import React from "react";
import styled from "styled-components";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import Homebar from "./Homebar";

const ContactContainer = styled.div`
  padding: 3rem;
  background: linear-gradient(135deg, #f9f9f9, #ececec);
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  border: 2px solid #ddd;
  border-radius: 15px;
  margin: 2rem auto;
  max-width: 800px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: #222;
  text-align: center;

  @media (max-width: 600px) {
    font-size: 2rem;
  }
`;

const ContactInfo = styled.div`
  margin-top: 2rem;
  text-align: center;
`;

const ContactItem = styled.p`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #444;

  svg {
    color: #4caf50;
    font-size: 1.5rem;
  }

  @media (max-width: 600px) {
    font-size: 1rem;
  }
`;

const EmailLink = styled.a`
  color: #333;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    color: #4caf50;
    text-decoration: underline;
  }
`;

const ContactDescription = styled.p`
  margin-top: 2rem;
  font-size: 1.1rem;
  line-height: 1.6;
  text-align: center;
  max-width: 600px;
  color: #555;

  @media (max-width: 600px) {
    font-size: 1rem;
  }
`;

const Contact = () => {
  return (
    <>
      <Homebar />
      <ContactContainer>
        <Title>Contact Us</Title>
        <ContactInfo>
          <ContactItem>
            <HiOutlineMail style={{ marginRight: "10px" }} />
            <EmailLink
              href="mailto:noreply.codesoldiers@gmail.com"
              aria-label="Send email"
            >
              noreply.codesoldiers@gmail.com
            </EmailLink>
          </ContactItem>
          <ContactItem>
            <HiOutlinePhone style={{ marginRight: "10px" }} />
            +91 9885291225
          </ContactItem>
        </ContactInfo>
        <ContactDescription>
          Have a question or want to discuss a project? Feel free to reach out
          to us using the information above. We’re always happy to hear from
          you!
        </ContactDescription>
      </ContactContainer>
    </>
  );
};

export default Contact;
