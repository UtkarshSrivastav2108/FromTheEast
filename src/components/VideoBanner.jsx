import React from 'react'
import styled from 'styled-components';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';

const Container = styled.div`
  flex: 1;
  margin: 3px;
  height: 70vh;
  position: relative;
  
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .2s;

 
`;

const Info = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  transition: all 0.5s ease;
  &:hover{
    background-color: rgba(0, 0, 0, 0.432);
    transition: background-color 0.9s ease;
  }



`;

const Icon = styled.div`

    transition: all 0.5s ease;
    &:hover {
      
      transform: scale(1.1);
    }
  `;
function VideoBanner() {
    return (
        <>
            <Container>
                <Image src="/assets/image/video.png" />
                <Info>
                    <Icon>

                        <PlayCircleOutlineIcon style={{ color: "white", fontSize: "70px", cursor: "pointer" }} />
                    </Icon>


                </Info>

            </Container>
        </>
    )
}

export default VideoBanner
