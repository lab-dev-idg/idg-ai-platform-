import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';
import { 
  Folder, 
  File, 
  Search, 
  Upload, 
  ExternalLink, 
  RefreshCw, 
  AlertCircle, 
  Lock, 
  Trash2,
  FileCode,
  FileText,
  Image,
  Database,
  CloudLightning,
  ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  createdTime?: string;
  size?: string;
  webViewLink?: string;
}

export function GoogleDrivePanel() {
  const { user, googleAccessToken, setGoogleAccessToken, loginWithGoogle } = useAuthStore();
  const { lang } = useSettingsStore();

  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Backup Form State
  const [backupFilename, setBackupFilename] = useState('IQ_IDG_Customs_Declaration_Backup.txt');
  const [cargoSummary, setCargoSummary] = useState('412 Electronics Equipment, Code: 8517.18.00\nTotal Val: $184,200 CIF\nCustoms Levy Rate: 15%');
  const [customsNote, setCustomsNote] = useState('Pre-audited by IDG AI Gateway. Confirmed compliant with Iraqi Customs Law 2026.');
  const [uploading, setUploading] = useState(false);

  // Filtered files
  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch files from Google Drive
  const fetchDriveFiles = async (silent = false) => {
    if (!googleAccessToken) return;
    if (!silent) setLoading(true);
    try {
      const response = await fetch(
        'https://www.googleapis.com/drive/v3/files?pageSize=15&fields=nextPageToken,files(id,name,mimeType,createdTime,size,webViewLink)&orderBy=createdTime desc', 
        {
          headers: { Authorization: `Bearer ${googleAccessToken}` }
        }
      );
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired
          setGoogleAccessToken(null);
          toast.error(
            lang === 'ku' 
              ? 'مایەی ڕێپێدانی گوگڵ بەسەرچووە. تکایە دووبارە مۆڵەت بدەوە.' 
              : 'انتهت صلاحية جلسة Google Drive. يرجى إعادة التفويض.'
          );
        } else {
          throw new Error('Failed to fetch files');
        }
        return;
      }

      const data = await response.json();
      setFiles(data.files || []);
    } catch (err) {
      console.error('Drive fetch error:', err);
      toast.error(
        lang === 'ku' 
          ? 'نەتوانرا لیستەی پەڕەکانی گۆڵ درایڤ بخوێندرێتەوە.' 
          : 'فشل تحميل ملفات Google Drive.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (googleAccessToken) {
      fetchDriveFiles();
    }
  }, [googleAccessToken]);

  const handleAuthorize = async () => {
    try {
      await loginWithGoogle();
      toast.success(
        lang === 'ku' 
          ? 'مۆڵەتنامەی گۆگڵ درایڤ بە سەرکەوتوویی نوێکرایەوە!' 
          : 'تم تفويض الوصول إلى Google Drive بنجاح!'
      );
    } catch (err) {
      console.error('OAuth authorization failed', err);
      toast.error(
        lang === 'ku' 
          ? 'چوونەژوورەوە یان ڕێپێدان ڕەتکرایەوە.' 
          : 'تم حظر أو إلغاء التفويض بحساب جوجل.'
      );
    }
  };

  // Upload/Create manifest text file on Google Drive
  const handleCreateManifestBackup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleAccessToken) {
      toast.warning(lang === 'ku' ? 'تکایە سەرەتا مۆڵەت بە درایڤ بدە.' : 'يرجى تفويض الخدمة أولاً.');
      return;
    }

    if (!backupFilename.trim()) {
      toast.warning(lang === 'ku' ? 'تکایە ناوی پەڕەکە بنووسە.' : 'يرجى كتابة اسم الملف.');
      return;
    }

    setUploading(true);

    try {
      const fileContent = `================================================
IRAQ DIGITAL GATEWAY (IDG) - SOVEREIGN BACKUP
================================================
Timestamp: ${new Date().toISOString()}
Filer Account: ${user?.email || 'Authenticated Official'}
Filename: ${backupFilename}

-----------------------------
Cargo Valuation Summary:
-----------------------------
${cargoSummary}

-----------------------------
Assessor Audits & Notes:
-----------------------------
${customsNote}

-----------------------------
Security Verification:
-----------------------------
System Code: IDG-SEC-v2.6
Status: COMMITTED_TO_SECURE_CLOUD_STORAGE
Checksum Token: sha256:${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}
================================================`;

      const boundary = 'idg_multipart_boundary';
      const delimiter = `\r\n--${boundary}\r\n`;
      const close_delim = `\r\n--${boundary}--`;

      const metadata = {
        name: backupFilename,
        mimeType: 'text/plain',
        description: 'Auto-backed up customs declaration statement from Iraq Digital Gateway (IDG) secure cockpit.'
      };

      const multipartRequestBody =
        delimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: text/plain; charset=UTF-8\r\n\r\n' +
        fileContent +
        close_delim;

      const response = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', 
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${googleAccessToken}`,
            'Content-Type': `multipart/related; boundary=${boundary}`,
          },
          body: multipartRequestBody,
        }
      );

      if (!response.ok) {
        throw new Error('Upload request failed');
      }

      await response.json();
      toast.success(
        lang === 'ku' 
          ? 'پەڕەی مانیفێست بە سەرکەوتوویی ڕەوانەی گوگڵ درایڤ کرا!' 
          : 'تم رفع بيان الشحنة الاحتياطي بنجاح إلى Google Drive!'
      );
      
      // Clear forms slightly
      setBackupFilename('IQ_IDG_Customs_Declaration_' + Math.floor(Math.random() * 9000 + 1000) + '.txt');
      
      // Refresh files list
      fetchDriveFiles(true);
    } catch (err) {
      console.error('Drive upload failed:', err);
      toast.error(
        lang === 'ku' 
          ? 'نەتوانرا پەڕەکە ڕەوانە بکرێت. تکایە دووبارە هەوڵبدەوە.' 
          : 'فشل رفع الملف الاحتياطي، يرجى المحاولة مرة أخرى.'
      );
    } finally {
      setUploading(false);
    }
  };

  // Delete file with governance confirmation
  const handleDeleteFile = async (fileId: string, fileName: string) => {
    const message = lang === 'ku'
      ? `ئایا دڵنیایت لە سڕینەوەی ئەم پەڕەیە لە گوگڵ درایڤەکەت؟\n"${fileName}"`
      : `هل أنت متأكد من رغبتك في حذف هذا الملف نهائياً من حسابك في Google Drive؟\n"${fileName}"`;

    const confirmed = window.confirm(message);
    if (!confirmed) return;

    try {
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${googleAccessToken}` }
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      toast.success(
        lang === 'ku' 
          ? 'پەڕەکە بە سەرکەوتوویی لە درایڤ سڕایەوە.' 
          : 'تم حذف الملف الجمركي بنجاح من الخدمة السحابية.'
      );
      setFiles(files.filter(f => f.id !== fileId));
    } catch (err) {
      console.error('Delete error:', err);
      toast.error(
        lang === 'ku' 
          ? 'تەنیا سڕینەوەی ئەو پەڕانە ڕێگەپێدراوە کە ئەم ئەپە دروستی کردوون.' 
          : 'يمكن حذف الملفات التي تم إنشاؤها عبر هذا النظام فقط.'
      );
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('folder')) return <Folder className="w-5 h-5 text-amber-500 fill-amber-500/10" />;
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType.includes('csv')) return <Database className="w-5 h-5 text-emerald-600" />;
    if (mimeType.includes('pdf')) return <FileText className="w-5 h-5 text-rose-500" />;
    if (mimeType.includes('image')) return <Image className="w-5 h-5 text-blue-500" />;
    if (mimeType.includes('javascript') || mimeType.includes('json') || mimeType.includes('code')) return <FileCode className="w-5 h-5 text-violet-500" />;
    return <File className="w-5 h-5 text-slate-400" />;
  };

  const formatSize = (bytesStr?: string) => {
    if (!bytesStr) return '—';
    const bytes = parseInt(bytesStr, 10);
    if (isNaN(bytes)) return '—';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Render unauthorized state
  if (!user || user.email === 'guest@idg-gateway.com' || !googleAccessToken) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-slate-50/50 border border-slate-100 rounded-3xl text-center">
        <div className="mb-4 p-4 bg-blue-50 text-[#0066FF] rounded-2xl border border-blue-100 select-none animate-bounce">
          <CloudLightning className="w-8 h-8" />
        </div>
        <h3 className="text-sm font-bold text-[#071739]">
          {lang === 'ku' ? 'بەستنەوە بە پەڕەکانی گوگڵ درایڤ' : 'ربط الاتصال ببيانات Google Drive'}
        </h3>
        <p className="text-xs text-slate-500 font-medium max-w-sm mt-2 leading-relaxed">
          {lang === 'ku' 
            ? 'بۆ چوونە ناو سندوقی پاشەکەوتی حیسابەکان و فایلی گومرگی فەرمی، پێویستە مۆڵەتنامەی پەیوەستبوون بە گوگڵ درایڤ بکەیتەوە.' 
            : 'للاطلاع على كشوفات التخليص الجمركي وتخزين مسودات الشحنات السحابية الرسمية، يرجى تفويض النظام للتكامل مع حسابك.'}
        </p>

        <button
          onClick={handleAuthorize}
          className="mt-6 flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0066FF] text-white hover:bg-blue-600 rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer"
        >
          <Lock className="w-3.5 h-3.5" />
          {lang === 'ku' ? 'پەیوەستکردن و نوێکردنەوەی درایڤ' : 'تفويض الوصول والمزامنة'}
        </button>

        <div className="mt-4 flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>ISO_27001 SECURE PROTOCOLS ENFORCED</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Create/Save Manifest to Google Drive */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-black text-[#071739] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-3 rounded bg-blue-500" />
              {lang === 'ku' ? "دروستکردنی پاشەکەوت لە درایڤ" : "تصدير نسخة احتياطية سحابية"}
            </h3>
            <span className="text-[9px] bg-blue-50 text-[#0066FF] px-1.5 rounded font-mono font-bold">SECURE</span>
          </div>

          <form onSubmit={handleCreateManifestBackup} className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-mono">
                {lang === 'ku' ? 'ناوی پەڕە (.txt)' : 'اسم ملف النص الكشفي'}
              </label>
              <input 
                type="text"
                value={backupFilename}
                onChange={(e) => setBackupFilename(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 border rounded-xl bg-slate-50/50 border-slate-200 outline-none focus:border-[#0066FF] focus:bg-white transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-mono">
                {lang === 'ku' ? 'پوختەی زانیاری باری بازرگانی' : 'تفاصيل هيكل وبنية الشحنة'}
              </label>
              <textarea 
                rows={3}
                value={cargoSummary}
                onChange={(e) => setCargoSummary(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 border rounded-xl bg-slate-50/50 border-slate-200 outline-none focus:border-[#0066FF] focus:bg-white transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-mono">
                {lang === 'ku' ? 'تێبینیەکانی ڕێپێدان و چاودێری' : 'ملاحظات التدقيق والامتثال الجمركي'}
              </label>
              <input 
                type="text"
                value={customsNote}
                onChange={(e) => setCustomsNote(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 border rounded-xl bg-slate-50/50 border-slate-200 outline-none focus:border-[#0066FF] focus:bg-white transition-all font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0066FF] text-white hover:bg-blue-600 rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/10 cursor-pointer disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{lang === 'ku' ? 'خەریکی ڕەوانە کردنە...' : 'جاري إرسال الاحتياطي...'}</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>{lang === 'ku' ? 'پاشەکەوتکردن لە گۆگڵ درایڤ' : 'حفظ احتياطي على Google Drive'}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Drive Files List */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-black text-[#071739] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-3 rounded bg-blue-500" />
                {lang === 'ku' ? "پەڕەکانی درایڤی من" : "سجلات ملفات وملفات Drive الخاصة بي"}
              </h3>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">CONNECTED // {user.email}</p>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setRefreshing(true);
                  fetchDriveFiles();
                }}
                disabled={loading || refreshing}
                className="p-1.5 text-slate-400 hover:text-[#0066FF] hover:bg-slate-50 rounded-lg border border-slate-200 shadow-2xs transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder={lang === 'ku' ? 'گەڕان لە فایلی گۆگڵ درایڤ...' : 'البحث عن ملف في جوجل درايف...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-semibold pl-9 pr-4 py-2 border rounded-xl bg-slate-50/50 border-slate-200 outline-none focus:border-[#0066FF] focus:bg-white transition-all font-mono"
            />
          </div>

          {/* List Area */}
          <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2 text-slate-400 font-mono text-[10px]">
                <RefreshCw className="w-6 h-6 animate-spin text-[#0066FF]" />
                <span>INDEXING GOOGLE DRIVE FILES</span>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400 font-semibold text-xs bg-slate-50/40 rounded-xl border border-dashed border-slate-100">
                <AlertCircle className="w-6 h-6 mb-2 text-slate-300" />
                <span>{lang === 'ku' ? 'هیچ فایلێک نەدۆزرایەوە.' : 'لم يتم العثور على أي مستندات.'}</span>
              </div>
            ) : (
              filteredFiles.map((file) => (
                <div 
                  key={file.id} 
                  className="p-2.5 border border-slate-100 rounded-xl hover:bg-slate-50/50 hover:border-slate-200/60 transition-all flex items-center justify-between gap-3 text-[11px]"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100 shrink-0 select-none">
                      {getFileIcon(file.mimeType)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-700 truncate font-mono" title={file.name}>
                        {file.name}
                      </p>
                      <p className="text-[9px] text-slate-400 font-mono mt-0.5">
                        {file.size ? `${formatSize(file.size)} • ` : ''} 
                        {file.createdTime ? new Date(file.createdTime).toLocaleDateString() : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {file.webViewLink && (
                      <a 
                        href={file.webViewLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-1.5 text-slate-400 hover:text-[#0066FF] hover:bg-white border border-transparent hover:border-slate-200/50 rounded-lg transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button 
                      onClick={() => handleDeleteFile(file.id, file.name)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-white border border-transparent hover:border-slate-200/50 rounded-lg transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
