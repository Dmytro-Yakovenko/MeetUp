import "./Modal.css"

function ModalDelete({onCancel, onSubmit, config}){

  const {question, btnSubmit, btnCancel}=config
    return (
<div id="myModal" class="modal">


<div class="modal-content" onClick={onCancel}>
  <span class="close" onClick={onCancel}>&times;</span>
  <p>{question}</p>
  <button 
  className="btn-submit"
  onClick={onSubmit}>
    {btnSubmit}
  </button>

  <button 
  className="btn-cancel"
  onClick={onCancel}>
    {btnCancel}
  </button>
</div>
</div>  
)
}

export default ModalDelete
