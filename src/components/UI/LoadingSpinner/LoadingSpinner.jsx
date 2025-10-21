import { keyframes, styled } from "styled-components"

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
`

const SpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`

const Spinner = styled.div`
  width: ${(props) => props.$size || "24px"};
  height: ${(props) => props.$size || "24px"};
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-top: 2px solid #fff;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`

const LoadingText = styled.span`
  color: #fff;
  font-family: "Bricolage Grotesque";
  font-size: 0.875rem;
  font-weight: 500;
  animation: ${pulse} 1.5s ease-in-out infinite;
`

const LoadingSpinner = ({
  size = "24px",
  text = "Loading...",
  showText = true,
  className = "",
}) => {
  return (
    <SpinnerContainer className={className}>
      <Spinner $size={size} />
      {showText && <LoadingText>{text}</LoadingText>}
    </SpinnerContainer>
  )
}

export default LoadingSpinner
