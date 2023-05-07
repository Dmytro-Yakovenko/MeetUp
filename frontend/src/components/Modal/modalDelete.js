import "./Modal.css"

function ModalDelete({onCancel, onSubmit, config}){

  const {question, btnSubmit, btnCancel}=config
    return (
<div id="myModal" class="modal">


<div class="modal-content" onClick={onCancel}>
  <span class="close" onClick={onCancel}>&times;</span>
  <p>{question}</p>
  <button onClick={onSubmit}>
    {btnSubmit}
  </button>

  <button onClick={onCancel}>
    {btnCancel}
  </button>
</div>
</div>  
)
}

export default ModalDelete
