import React from 'react';

import { Container } from './styles';

interface SignUpProps {
  myProps?: boolean;
}

const SignUp: React.FC<SignUpProps> = () => {
  return (
    <Container>
      <h1>Hello - SignUp</h1>
    </Container>
  );
};

export default SignUp;
