import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FiLogOut, FiLogIn, FiMenu, FiX } from "react-icons/fi";
import { jwtDecode } from "jwt-decode";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Navbar = styled.nav`
  background-color: #008bff;
  padding: 1rem 0;
`;

const StyledContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
`;

const Brand = styled.span`
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
`;

const NavLinks = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;

  @media (max-width: 768px) {
    display: ${({ $open }) => ($open ? "flex" : "none")};
    flex-direction: column;
    position: absolute;
    top: 70px;
    right: 20px;
    background: #0077e6;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 100;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

const NavLink = styled.li`
  margin-left: 3rem;

  @media (max-width: 768px) {
    margin: 0.8rem 0;
  }
`;

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  transition: opacity 0.3s ease;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  height: 100%;

  &:hover {
    opacity: 0.8;
  }

  svg {
    margin-right: 8px;
  }

  &.logout-link {
    display: flex;
    align-items: center;
    line-height: 1;
    margin-top: -2px;
  }
`;

const MenuToggle = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.8rem;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Homebar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const queryClient = useQueryClient();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Invalid token", err);
        setIsAuthenticated(false);
      }
    }
  }, []);

const handleLogout = () => {
    localStorage.removeItem("token");
    queryClient.removeQueries(["user"]); // <-- clear user from cache
    setIsAuthenticated(false);
    toast.success("You have been logged out."); // <-- toast message
    navigate("/", { replace: true });
  };

  return (
    <Navbar>
      <StyledContainer>
        <LogoLink to="/home">
          <Brand>CodeSoldiers</Brand>
        </LogoLink>

        <RightSection>
          <MenuToggle onClick={() => setMenuOpen((prev) => !prev)}>
            {menuOpen ? <FiX /> : <FiMenu />}
          </MenuToggle>
        </RightSection>

        <NavLinks $open={menuOpen}>
          <NavLink>
            <StyledLink to="/home" onClick={() => setMenuOpen(false)}>
              Home
            </StyledLink>
          </NavLink>
          <NavLink>
            <StyledLink to="/about" onClick={() => setMenuOpen(false)}>
              About Us
            </StyledLink>
          </NavLink>
          <NavLink>
            <StyledLink to="/contact" onClick={() => setMenuOpen(false)}>
              Contact
            </StyledLink>
          </NavLink>

          {isAuthenticated ? (
            <NavLink>
              <StyledLink
                as="button"
                type="button"
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="logout-link"
              >
                <FiLogOut />
                Logout
              </StyledLink>
            </NavLink>
          ) : (
            <NavLink>
              <StyledLink
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="logout-link"
              >
                <FiLogIn />
                Login
              </StyledLink>
            </NavLink>
          )}
        </NavLinks>
      </StyledContainer>
    </Navbar>
  );
};

export default Homebar;
