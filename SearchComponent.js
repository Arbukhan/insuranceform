import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Table, Modal } from 'react-bootstrap';
import axios from 'axios';

const SearchComponent = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [show, setShow] = useState(false);
  const [editData, setEditData] = useState({
    policyType: '',
    firstName: '',
    middleName: '',
    lastName: '',
    fullName: '',
    birthDate: '',
    _id: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get('http://localhost:5000/api/insurance');
      setResults(data);
    };

    fetchData();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    const { data } = await axios.get('http://localhost:5000/api/insurance');
    const filtered = data.filter(item =>
      item.fullName.toLowerCase().includes(search.toLowerCase())
    );
    setResults(filtered);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/insurance/${id}`);
    setResults(results.filter(item => item._id !== id));
  };

  const handleEdit = async (id) => {
    const { data } = await axios.get(`http://localhost:5000/api/insurance/${id}`);
    setEditData(data);
    setShow(true);
  };

  const handleEditSubmit = async () => {
    await axios.put(`http://localhost:5000/api/insurance/${editData._id}`, editData);
    setShow(false);
    const { data } = await axios.get('http://localhost:5000/api/insurance');
    setResults(data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
    if (['firstName', 'middleName', 'lastName'].includes(name)) {
      setEditData(prev => ({
        ...prev,
        fullName: `${prev.firstName} ${prev.middleName} ${prev.lastName}`
      }));
    }
  };

  return (
    <Container>
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Form onSubmit={handleSearch}>
            <Form.Group controlId="search">
              <Form.Label>Search by Full Name</Form.Label>
              <Form.Control
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Search
            </Button>
          </Form>

          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Policy Type</th>
                <th>Date of Birth</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result._id}>
                  <td>{result._id}</td>
                  <td>{result.fullName}</td>
                  <td>{result.policyType}</td>
                  <td>{new Date(result.birthDate).toLocaleDateString()}</td>
                  <td>
                    <Button variant="warning" className="mr-2" onClick={() => handleEdit(result._id)}>Edit</Button>
                    <Button variant="danger" onClick={() => handleDelete(result._id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Insurance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="policyType">
              <Form.Label>Policy Type</Form.Label>
              <Form.Control
                as="select"
                name="policyType"
                value={editData.policyType}
                onChange={handleInputChange}
              >
                <option value="">Select Policy Type</option>
                <option value="private">Private</option>
                <option value="company">Company</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={editData.firstName}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="middleName">
              <Form.Label>Middle Name</Form.Label>
              <Form.Control
                type="text"
                name="middleName"
                value={editData.middleName}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={editData.lastName}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="fullName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control type="text" value={editData.fullName} readOnly />
            </Form.Group>

            <Form.Group controlId="birthDate">
              <Form.Label>Birth Date</Form.Label>
              <Form.Control
                type="date"
                name="birthDate"
                value={editData.birthDate.split('T')[0]}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SearchComponent;
