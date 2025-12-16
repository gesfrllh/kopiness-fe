import { Range } from "@/utils/general";

export const usePagination = ({
  page,
  totalPage,
  siblingCount = 1,
  boundaryCount = 1
} : {
  page: number;
  totalPage: number;
  siblingCount?: number;
  boundaryCount?: number
}) => {
  const totalPageNumbers = siblingCount * 2 + boundaryCount * 2 + 3;

  if(totalPageNumbers >= totalPage) {
    return Range(1, totalPage)
  }

  const leftSiblingIndex =  Math.max(page - siblingCount, boundaryCount + 1);
  const rightSiblingIndex = Math.min(
    page + siblingCount,
    totalPage - boundaryCount
  )

  const showLeftDots = leftSiblingIndex > boundaryCount + 2;
  const showRightDots = rightSiblingIndex < totalPage - (boundaryCount + 1)

  const firstPages = Range(1, boundaryCount)
  const lastPages = Range(totalPage - boundaryCount + 1, totalPage)

  if (!showLeftDots && showRightDots) {
    const leftRange = Range(1, rightSiblingIndex + 1)
    return [...leftRange, '...', ...lastPages]
  }

  if(showLeftDots && !showRightDots) {
    const rightRange =  Range(leftSiblingIndex, totalPage)
    return [...firstPages, '...', ...rightRange]
  }

  if(showLeftDots && showRightDots) {
    const middleRange = Range(leftSiblingIndex, rightSiblingIndex)
    return [...firstPages,  '...', ...middleRange, '...', ...lastPages]
  }
}