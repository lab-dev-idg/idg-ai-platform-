export const rtlStyles = {
  // Use these logical classes instead of physical (ml/mr, pl/pr)
  spacing: {
    ml: "ms-", // margin-start
    mr: "me-", // margin-end
    pl: "ps-", // padding-start
    pr: "pe-", // padding-end
  },
  borders: {
    bl: "border-s", // border-start
    br: "border-e", // border-end
    roundedL: "rounded-s", // top-start, bottom-start
    roundedR: "rounded-e", // top-end, bottom-end
  },
  positions: {
    left: "start-0",
    right: "end-0",
  }
};

/**
 * A utility hook that determines the current layout direction based on document.dir.
 */
export function useDirection() {
  const dir = typeof document !== 'undefined' ? document.documentElement.dir : 'rtl';
  return {
    dir: dir as 'rtl' | 'ltr',
    isRtl: dir === 'rtl',
    isLtr: dir === 'ltr',
  };
}
