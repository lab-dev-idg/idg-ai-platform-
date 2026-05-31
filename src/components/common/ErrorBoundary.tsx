import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught Digital Gateway Error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.hash = "";
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Read language from settings store safely
      let lang = "ku";
      try {
        const stored = localStorage.getItem("app-lang");
        if (stored === "ar") {
          lang = "ar";
        }
      } catch (e) {
        console.warn("Could not read local storage for error boundary", e);
      }

      const isKurdish = lang === "ku";

      return (
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 p-6 font-sans">
          <div className="max-w-md w-full bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8 space-y-6 text-center">
            {/* Warning Icon */}
            <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/20 text-rose-500 dark:text-rose-400 rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-rose-100 dark:border-rose-900/10 animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            {/* Error Message Header */}
            <div className="space-y-2">
              <h1 className="text-base font-black uppercase tracking-wider text-slate-900 dark:text-white">
                {isKurdish ? "هەڵەیەکی چاوەڕواننەکراو ڕوویدا" : "حدث خطأ غير متوقع في النظام"}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
                {isKurdish
                  ? "سیستەمەکە ناتوانێت خزمەتگوزارییەکە باربکات بەهۆی ناتەواویەکی ناوەخۆییەوە. کۆنترۆڵی ئاسایش لە کاردایە بۆ پاراستنی داتا فیدراڵییەکان."
                  : "عذرًا، تعذر تحميل واجهة النظام بسبب استثناء داخلي في بيئة التشغيل الأساسية. تم تأمين جلسة العمل لحماية البيانات السيادية الفيدرالية."}
              </p>
            </div>

            {/* Debug Code Block */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl text-[10px] text-slate-500 font-mono text-left max-h-40 overflow-y-auto w-full">
              <span className="font-bold text-rose-500 font-sans block mb-1">
                [SYSTEM_FAULT_DIAGNOSTICS]
              </span>
              <span className="block break-all">{this.state.error?.toString()}</span>
              {this.state.errorInfo && (
                <span className="block mt-1 whitespace-pre-wrap">{this.state.errorInfo.componentStack}</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5">
              <button
                onClick={this.handleReset}
                className="w-full bg-[#0066FF] hover:bg-blue-600 active:scale-97 text-white py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-blue-500/10"
              >
                {isKurdish ? "نوێکردنەوەی خێرا" : "إعادة تشغيل الجلسة"}
              </button>
              <button
                onClick={() => { window.location.href = "/"; }}
                className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-2.5 px-4 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                {isKurdish ? "گەڕانەوە بۆ لۆبی سەرەکی" : "العودة إلى البوابة الرئيسية"}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
