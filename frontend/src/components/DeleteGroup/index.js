


function DeleteGroup({ onConfirm, onCancel }){
    return(
        <div>
        <div className="modal-title">Confirm Delete</div>
        <div className="modal-message">
          Are you sure you want to remove this group?
        </div>
        <button className="modal-yes-button" onClick={onConfirm}>
          Yes (Delete Group)
        </button>
        <button className="modal-no-button" onClick={onCancel}>
          No (Keep Group)
        </button>
      </div>
    );
    
}

export default DeleteGroup