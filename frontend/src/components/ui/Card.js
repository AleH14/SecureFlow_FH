import React from 'react';
import { Card as BootstrapCard } from 'react-bootstrap';

const Card = ({ children, className = '', ...props }) => {
  return (
    <BootstrapCard className={`custom-card ${className}`} {...props}>
      {children}
    </BootstrapCard>
  );
};

const CardHeader = ({ children, className = '', ...props }) => (
  <BootstrapCard.Header className={`custom-card-header ${className}`} {...props}>
    {children}
  </BootstrapCard.Header>
);

const CardBody = ({ children, className = '', ...props }) => (
  <BootstrapCard.Body className={`custom-card-body ${className}`} {...props}>
    {children}
  </BootstrapCard.Body>
);

const CardFooter = ({ children, className = '', ...props }) => (
  <BootstrapCard.Footer className={`custom-card-footer ${className}`} {...props}>
    {children}
  </BootstrapCard.Footer>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;