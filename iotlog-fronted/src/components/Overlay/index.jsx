import ReactDOM from 'react-dom';
import React from 'react';
import { usePopoverPosition } from '@paljs/ui/utils/popoverPosition';
import { OverlayStyle } from '@paljs/ui/PopoverLay/style';

const initialContext = {
  positionHandle() {},
  hide() {},
};

export const OverLayContext = React.createContext(initialContext);
const Overlay = (props) => {
  const overlayRef = React.useRef(null);
  const targetRef = React.useRef(null);
  const { position, placement, show, setShow, positionHandle } = usePopoverPosition(props, targetRef, overlayRef);

  let timeOut;
  const onMouseLeave = () => {
    timeOut = setTimeout(() => {
      setShow(false);
    }, 500);
  };

  const onMouseEnter = () => {
    clearTimeout(timeOut);
  };

  const { trigger, transformSize, positionOverlay, showControlOutside, controlOutside } = props;

  const overlayMouse = props.contextMenu
    ? {}
    : {
        onMouseEnter: () => trigger === 'hover' && onMouseEnter(),
        onMouseLeave: () => trigger === 'hover' && onMouseLeave(),
      };

  const targetMouse = props.contextMenu
    ? {
        onClick: (e) => {
          e.stopPropagation();
          setShow(!show);
        },
      }
    : {
        onFocus: () => trigger === 'focus' && setShow(true),
        onBlur: () => trigger === 'focus' && setShow(false),
        onClick: (e) => {
          e.stopPropagation();
          trigger === 'click' && setShow(!show);
        },
        onMouseEnter: () =>
          trigger === 'hint'
            ? setShow(true)
            : trigger === 'hover' && !show
            ? setShow(true)
            : trigger === 'hover' && onMouseEnter(),
        onMouseLeave: () => {
          trigger === 'hint' ? setShow(false) : trigger === 'hover' && onMouseLeave();
        },
      };

  const showOverlay = controlOutside
  ? showControlOutside
  : show

  return (
    <>
      {showOverlay &&
        ReactDOM.createPortal(
          <OverlayStyle
            position={!!position}
            placement={placement}
            size={transformSize}
            arrowRound={props.arrowRound}
            arrowSize={props.arrowSize}
          >
            <OverLayContext.Provider value={{ positionHandle, hide: () => setShow(false) }}>
              <div
                className="overlay-pane"
                style={positionOverlay ? positionOverlay : position && { top: position.top < 0 ? 80 : position.top , right: 5 }}
                ref={overlayRef}
                onClick={(e) => e.stopPropagation()}
                {...overlayMouse}
              >
                {props.children}
              </div>
            </OverLayContext.Provider>
          </OverlayStyle>,
           document.getElementById('overlay-container'),
        )}
      <div style={props.style} className={props.className} ref={targetRef} {...targetMouse}>
        {props.target}
      </div>
    </>
  );
};

export default Overlay;
