import styled from 'styled-components';

export const BackButton = styled.button`
  position: fixed;
  left: 50%;
  bottom: 40px;
  transform: translateX(-50%);
  padding: 8px 18px;
  background-color: #f0f0f0;
  border: 2px solid #ccc;
  border-radius: 7px;
  cursor: pointer;
  color: #111;
  font-size: 1rem;
  font-weight: bold;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: background 0.2s, box-shadow 0.2s;
  white-space: nowrap;
  min-width: 120px;
  max-width: 200px;
  box-sizing: border-box;
  &:hover {
    background-color: #e0e0e0;
    box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  }
`; 