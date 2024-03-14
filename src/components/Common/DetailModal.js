
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

const DetailModal = (props) => {
  const { show, title, onClose } = props;
  const [description, setDescription] = useState('');
  const [comment, setComment] = useState('');
  const [commentList, setCommentList] = useState([]);
  const [commentsVisible, setCommentsVisible] = useState(true);
  const maxDescriptionLength = 100;

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxDescriptionLength) {
      setDescription(value);
    }
  };
  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };
  const handleSaveChanges = () => {
    if(comment.trim() !== '') {
      setCommentList([...commentList, comment]);
      setComment('');
      // onClose();
  }}
  const handleToggleComments = () => {
    setCommentsVisible(!commentsVisible);
  };
  return (
    <>
      <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title><i className="fa fa-file-text" aria-hidden="true"></i> {title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form style={{marginBottom: '10px'}}>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label><i className="fa fa-align-left" aria-hidden="true"></i> Discription</Form.Label>
              <Form.Control 
                as="textarea"
                rows={5} 
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Enter description here..."
              />
              
              {/* <p style={{ position: 'absolute', bottom: 292, right: 0, marginRight: '33px' }}>
                {description.length}/{maxDescriptionLength}
              </p> */}
            </Form.Group>
            <Button variant="primary" onClick={handleSaveChanges}> Save </Button>
          </Form>
          <Form style={{marginBottom: '10px'}}>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea2"
            >
              <Form.Label><i className="fa fa-list-ul" aria-hidden="true"></i> Activity</Form.Label>
              <Form.Control 
                as="textarea"
                rows={1} 
                value={comment}
                onChange={handleCommentChange}
                placeholder="Enter comments here..."
              />
            </Form.Group>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <Button variant="primary" onClick={handleSaveChanges}> Save </Button>
                {commentsVisible ? (
                  <Button variant="primary" onClick={handleToggleComments}>Hide Comments</Button>
                  ) : (
                      <Button variant="primary" onClick={handleToggleComments}>Unhide Comments</Button>
                )}
              </div>
          </Form>
          {commentsVisible && (
            <div>  
              <ul style={{ listStyleType: 'none', padding:0 }}>
                {commentList.map((item, index) => (
                  <li key={index}><i className="fa fa-user-circle" aria-hidden="true"></i> {item}</li>
                ))}
              </ul>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default DetailModal;