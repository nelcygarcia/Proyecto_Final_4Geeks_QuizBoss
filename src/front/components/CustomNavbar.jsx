import React from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";

export const CustomNavbar = ({ playerName = "Jugador" }) => {
	return (
		<Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
			<Container>
				<Navbar.Brand href="#home" className="fw-bold text-warning">
					🎯 TriviaGame
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
					<Nav className="me-3">
						<Nav.Link href="#profile" className="text-light">
							👤 {playerName}
						</Nav.Link>
					</Nav>
					<Button variant="outline-warning" size="sm">
						Cerrar sesión
					</Button>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};
