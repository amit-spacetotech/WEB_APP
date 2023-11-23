import React from "react";
import { RxCross2 } from "react-icons/rx";
import { Modal, Button } from "react-bootstrap";
import styles from "./style.module.css";
import { useRouter } from "next/router";
function CommonModal({
  show,
  setShow,
  title,
  hide,
  primaryFunction,
  bodyContent,
  centered = true,
  ...props
}) {
  const router = useRouter();
  const handleClick = () => {
    if (props.step === 6) {
      window.location.reload();
    }
    if (props.userprofile) {
      router.push("/guestuser");
      props.getUser();
      return;
    }
    setShow();
  };

  return (
    <>
      <Modal
        show={show ? true : false}
        onHide={setShow}
        keyboard={false}
        backdrop="static"
        size={props.size ?? "md"}
        dialogClassName={props.className}
        aria-labelledby="contained-modal-title-vcenter"
        centered={centered}
      >
        {title && (
          <Modal.Header closeButton>
            <Modal.Title
              style={{ fontWeight: 900, color: "#311960" }}
              id="contained-modal-title-vcenter"
            >
              {title}
            </Modal.Title>
          </Modal.Header>
        )}
        <Modal.Body>
          {!hide && (
            <div className="mb-3">
              <RxCross2
                style={{
                  position: "absolute",
                  right: "15px",
                  fontWeight: "bolder",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  handleClick();
                }}
              />
            </div>
          )}

          {bodyContent}
        </Modal.Body>
        {primaryFunction && (
          <Modal.Footer>
            <Button variant="danger" onClick={setShow}>
              Cancel
            </Button>
            <Button
              style={{ backgroundColor: "#8348F2" }}
              className="ml-2"
              onClick={primaryFunction}
            >
              Yes
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </>
  );
}

export default CommonModal;
