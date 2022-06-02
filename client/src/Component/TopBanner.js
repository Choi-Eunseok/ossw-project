import './App.css';
import axios from "axios";
import { useEffect } from 'react';
import { Navbar, Container, NavDropdown, Nav} from 'react-bootstrap'
import khuimg from '../img/khumeal.png'

function TopBanner() {
  const callApi = async()=>{
    axios.get("/api").then((res)=>{console.log(res.data.test)});
  };

  useEffect(()=>{
    callApi();
  }, []);
  
  return (
    
    <Navbar bg="#ff0000" expand="lg" style={{ background:'#9E1915', padding:'0%', margin:'0 auto'}} >
            <Container style={{margin:'0 auto'}}>
            <img src = {khuimg} height="40px" width="40px" />
            <Navbar.Brand href="#home"><p style={{color:'white'}}>제2긱 학식 커뮤니티</p></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                <Nav.Link href="#home"><p style={{color:'white'}}>메뉴</p></Nav.Link>
                <Nav.Link href="#link"><p style={{color:'white'}}>메뉴에 대한 이야기</p></Nav.Link>
                <Nav.Link href="#link"><p style={{color:'white'}}>글 작성</p></Nav.Link>
                </Nav>
            </Navbar.Collapse>
            </Container>
        </Navbar>
  );
}

export default TopBanner;