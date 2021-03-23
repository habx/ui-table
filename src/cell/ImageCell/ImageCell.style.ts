import styled from 'styled-components'

import { zIndex } from '../../_internal/zIndex'

export const IMAGE_ZOOM_SIZE = 120
export const IMAGE_SIZE = 36

export const ImageZoom = styled.img`
  border-radius: 2px;
  height: ${IMAGE_ZOOM_SIZE}px;
  width: ${IMAGE_ZOOM_SIZE}px;
  object-fit: contain;
  position: fixed;

  z-index: ${zIndex.overlay};

  margin-left: 8px;
  margin-top: -16px;
  animation: fadein 200ms;

  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

export const ImageCellContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
`

export const Image = styled.img`
  border-radius: 4px;
  height: ${IMAGE_SIZE}px;
  width: ${IMAGE_SIZE}px;
  object-fit: cover;
`
