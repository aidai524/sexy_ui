export enum MaskPlacement {
  TopLeft,
  Top,
  TopRight,
  RightTop,
  Right,
  RightBottom,
  BottomRight,
  Bottom,
  BottomLeft,
  LeftBottom,
  Left,
  LeftTop,
  Center
}

export const getMaskBoundRect = (
  element: HTMLElement,
  container: HTMLElement
) => {
  if (!element) {
    return {};
  }

  const { height, width, left, top } = element.getBoundingClientRect();
  const elementTopWithScroll = container.scrollTop + top;
  const elementLeftWithScroll = container.scrollLeft + left;

  return {
    width: container.scrollWidth,
    height: container.scrollHeight,
    top: elementTopWithScroll,
    left: elementLeftWithScroll,
    elementWidth: width,
    elementHeight: height,
    radius: 10
  };
};

const HIGHLIGHT_PADDING = 5;
const SPACING = 20;

export const getPositionStyle = (
  placement: MaskPlacement,
  top: number,
  left: number,
  elementWidth: number,
  elementHeight: number,
  contentWidth: number,
  contentHeight: number
) => {
  const highlightWidth = elementWidth + HIGHLIGHT_PADDING * 2;
  const highlightHeight = elementHeight + HIGHLIGHT_PADDING * 2;
  const highlightLeft = left - HIGHLIGHT_PADDING;
  const highlightTop = top - HIGHLIGHT_PADDING;

  switch (placement) {
    case MaskPlacement.TopLeft:
      return {
        top: highlightTop - contentHeight - 30,
        left: highlightLeft - contentWidth + 100
      };
    case MaskPlacement.Top:
      return {
        top: highlightTop - contentHeight - 30,
        left: highlightLeft + highlightWidth / 2 - contentWidth / 2
      };
    case MaskPlacement.TopRight:
      return {
        top: highlightTop - contentHeight - 30,
        left: highlightLeft - 10
      };
    case MaskPlacement.RightTop:
      return {
        top: highlightTop - SPACING,
        left: highlightLeft + highlightWidth + SPACING
      };
    case MaskPlacement.Right:
      return {
        top: highlightTop + highlightHeight / 2 - contentHeight / 2,
        left: highlightLeft + highlightWidth + SPACING
      };
    case MaskPlacement.RightBottom:
      return {
        top: highlightTop + highlightHeight + SPACING - contentHeight,
        left: highlightLeft + highlightWidth + SPACING
      };
    case MaskPlacement.BottomRight:
      return {
        top: highlightTop + highlightHeight + 20,
        left: highlightLeft - contentWidth + 60
      };
    case MaskPlacement.Bottom:
      return {
        top: highlightTop + highlightHeight + 30,
        left: highlightLeft + highlightWidth / 2 - contentWidth / 2
      };
    case MaskPlacement.BottomLeft:
      return {
        top: highlightTop + highlightHeight - 40,
        left: highlightLeft - contentWidth - 30
      };
    case MaskPlacement.LeftBottom:
      return {
        top: highlightTop + highlightHeight + SPACING - contentHeight,
        left: highlightLeft - contentWidth - 30
      };
    case MaskPlacement.Left:
      return {
        top: highlightTop + highlightHeight / 2 - contentHeight / 2,
        left: highlightLeft - elementWidth - contentWidth
      };
    case MaskPlacement.LeftTop:
      return {
        top: highlightTop - SPACING,
        left: highlightLeft - contentWidth - 30
      };
    case MaskPlacement.Center:
      return {
        top: highlightTop + highlightHeight / 2 - contentHeight / 2,
        left: highlightLeft + highlightWidth / 2 - contentWidth / 2
      };
    default:
      return {
        top: highlightTop + highlightHeight + SPACING,
        left: highlightLeft + highlightWidth + SPACING
      };
  }
};
