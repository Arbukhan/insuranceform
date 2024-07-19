import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';

const FormComponent = () => {
  const [policyType, setPolicyType] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [age, setAge] = useState('');
  const [insuranceEntries, setInsuranceEntries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get('http://localhost:5000/api/insurance');
      setInsuranceEntries(data);
    };

    fetchData();
  }, []);

  const calculateAge = (dob) => {
    const diff = new Date() - new Date(dob);
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { policyType, firstName, middleName, lastName, fullName, birthDate };
    const response = await axios.post('http://localhost:5000/api/insurance', data);
    setInsuranceEntries([...insuranceEntries, response.data]);
    // Clear form after submission
    setPolicyType('');
    setFirstName('');
    setMiddleName('');
    setLastName('');
    setFullName('');
    setBirthDate('');
    setAge('');
  };

  const handlePolicyChange = (e) => {
    setPolicyType(e.target.value);
  };

  return (
    <Container>
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Form.Group controlId="policyType">
            <Form.Label>Policy Type</Form.Label>
            <Form.Control
              as="select"
              value={policyType}
              onChange={handlePolicyChange}
            >
              <option value="">Select Policy Type</option>
              <option value="private">Private</option>
              <option value="company">Company</option>
            </Form.Control>
          </Form.Group>

          {policyType && (
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setFullName(`${e.target.value} ${middleName} ${lastName}`);
                  }}
                />
              </Form.Group>

              <Form.Group controlId="middleName">
                <Form.Label>Middle Name</Form.Label>
                <Form.Control
                  type="text"
                  value={middleName}
                  onChange={(e) => {
                    setMiddleName(e.target.value);
                    setFullName(`${firstName} ${e.target.value} ${lastName}`);
                  }}
                />
              </Form.Group>

              <Form.Group controlId="lastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setFullName(`${firstName} ${middleName} ${e.target.value}`);
                  }}
                />
              </Form.Group>

              <Form.Group controlId="fullName">
                <Form.Label>Full Name</Form.Label>
                <Form.Control type="text" value={fullName} readOnly />
              </Form.Group>

              <Form.Group controlId="birthDate">
                <Form.Label>Birth Date</Form.Label>
                <Form.Control
                  type="date"
                  value={birthDate}
                  onChange={(e) => {
                    setBirthDate(e.target.value);
                    setAge(calculateAge(e.target.value));
                  }}
                />
              </Form.Group>

              <Form.Group controlId="age">
                <Form.Label>Age</Form.Label>
                <Form.Control type="text" value={age} readOnly />
              </Form.Group>

              <Button variant="primary" type="submit">
                Submit
              </Button>
              <Button className="m-2" variant="primary" onClick={()=>setInsuranceEntries([])}>Clear</Button>
            </Form>
          )}
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Policy Type</th>
                <th>Date of Birth</th>
              </tr>
            </thead>
            <tbody>
              {insuranceEntries.map((entry) => (
                <tr key={entry._id}>
                  <td>{entry._id}</td>
                  <td>{entry.fullName}</td>
                  <td>{entry.policyType}</td>
                  <td>{new Date(entry.birthDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default FormComponent;
