import './App.css';
import axios from "axios";
import { useEffect } from 'react';
import { Navbar, Container, NavDropdown, Nav} from 'react-bootstrap'
import khuimg from '../img/khumeal.png'

function App() {
  const callApi = async()=>{
    axios.get("/api").then((res)=>{console.log(res.data.test)});
  };

  useEffect(()=>{
    callApi();
  }, []);
  
  return (
    
    <Navbar bg="#ff0000" expand="lg" style={{ background:'#9E1915'}} >
            <Container>
            <img src = {khuimg} height="40px" width="40px" />
            <Navbar.Brand href="#home">제2긱 학식 커뮤니티</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                <Nav.Link href="#home">메뉴</Nav.Link>
                <Nav.Link href="#link">메뉴에 대한 이야기</Nav.Link>
                <Nav.Link href="#link">글 작성</Nav.Link>
                </Nav>
            </Navbar.Collapse>
            </Container>
        </Navbar>
  );
}

export default App;