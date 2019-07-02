
export const overworldZoom = 1;
export const localZoom = Math.pow(10, 2);

export const zoomFactor = (isDetail: boolean) => isDetail ? localZoom : overworldZoom;
