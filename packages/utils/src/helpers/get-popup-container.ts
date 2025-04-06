/**
 * If the node is holding inside a form, return the form element,
 * otherwise return the parent node of the given element or
 * the document body if the element is not provided.
 */
export function getPopupContainer(node?: HTMLElement): HTMLElement {
  return (
    node?.closest('form') ?? (node?.parentNode as HTMLElement) ?? document.body
  );
}

/**
 * VxeTable专用弹窗层
 * 解决问题: https://gitee.com/dapppp/ruoyi-plus-vben5/issues/IB1DM3
 * @param _node 触发的元素
 * @returns 挂载节点
 */
export function getVxePopupContainer(_node?: HTMLElement): HTMLElement {
  /**
   * 需要区分是否为固定列情况 如果为固定列返回parent会导致展开宽度不正常
   * 如果是固定列的情况直接返回body 但是这样不会跟随滚动(个人认为这属于极限场景)
   * 如果有更好的办法解决 请告知
   */
  // if (_node?.closest('td.fixed--width')) {
  //   return document.body;
  // }
  /**
   * 兼容以前代码 先返回body 这样会造成无法跟随滚动
   */
  return _node?.parentElement ?? document.body;
}
