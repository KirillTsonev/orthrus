import {useInteractionStore} from "../store/interaction/InteractionStore";
import {useGlobalStore} from "../store/global/GlobalStore";

export const UploadModal = () => {
  const isUploadModalOpen = useInteractionStore((s) => s.isUploadModalOpen);
  const csvData = useGlobalStore((s) => s.csvData);
  const totalRowsNumber = useGlobalStore((s) => s.totalRowsNumber);

  return (
    <div>
      {isUploadModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: "8px",
              minWidth: "300px",
              textAlign: "center",
            }}
          >
            <h2>Upload Modal</h2>
            <div>
              {csvData.length} contacts created / {totalRowsNumber - csvData.length} rows skipped
            </div>
            <button
              onClick={() => {
                useInteractionStore.setState((s) => ({
                  ...s,
                  isUploadModalOpen: false,
                }));
              }}
              style={{marginTop: "20px"}}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
