import './App.css';
import { Navbar, Container, Nav} from 'react-bootstrap'
import khuimg from '../img/khumeal.png'

function TopBanner() {
  
  return (
    
    <Navbar bg="#ff0000" expand="lg" style={{ background:'#9E1915', padding:'0%', margin:'0 auto'}} >
            <Container style={{margin:'0 auto'}}>
            <img src = {khuimg} height="40px" width="40px" />
            <Navbar.Brand href="/"><p style={{color:'white'}}>제2긱 학식 커뮤니티</p></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                <Nav.Link href="/menu"><p style={{color:'white'}}>메뉴</p></Nav.Link>
                <Nav.Link href="/"><p style={{color:'white'}}>메뉴에 대한 이야기</p></Nav.Link>
                <Nav.Link href="#link"><p style={{color:'white'}}>글 작성</p></Nav.Link>
                </Nav>
            </Navbar.Collapse>
            </Container>
        </Navbar>
  );
}

export default TopBanner;