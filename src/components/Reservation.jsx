import React from 'react'
import styled from 'styled-components';

const Container = styled.div`
display:flex;
justify-content:center;
align-items:center"
padding:20px;
background-color:lightyellow;

`;

const Heading = styled.div`
display:flex;
justify-content:center;
align-items:center"
background-color:lightyellow;

`;

const Subeading = styled.div`
display:flex;
justify-content:center;
align-items:center"
background-color:lightyellow;
`;

const ParaHeading = styled.div`
display:flex;
justify-content:center;
align-items:center"
`;
const FormContainer = styled.div`
width:50vw;
height:50vh;
display:flex;
justify-content: center;
`;




const Button = styled.button`
padding: 15px 25px;
font-size: 16px;
border:none;
background-color: red;
color:white;
border-radius:20px;
cursor: pointer;
margin-left: 30px;
margin-top: 50px;
&:hover {
  background-color: white;
  transition: background-color 0.8s ease;
  
color:red;
border:1px solid red;
display:flex;
justify-content:center;
align-items:center;
}
`;


function Reservation() {
    return (
        <>
            <Heading style={{ backgroundColor: "lightyellow" }}>
                <h1 style={{ color: "black", marginTop: "70px", marginBottom: "20px" }}>RESERVATIONS</h1>

            </Heading>
            <Heading style={{ backgroundColor: "lightyellow" }}>
                <hr style={{ background: "red", border: "none", marginBottom: "20px", display: "flex", width: "180px", justifyContent: "center", alignItems: "center", textDecorationColor: "red", height: "2px", content: "", }} />
            </Heading>

            <Subeading style={{ backgroundColor: "lightyellow" }}>
                <h3 style={{ color: "black", marginTop: "10px", marginBottom: "20px" }}>BOOKING FORM</h3>
            </Subeading>

            <ParaHeading style={{ backgroundColor: "lightyellow" }}>
                <p style={{ color: "black", marginTop: "1px", marginBottom: "20px" }}>PLEASE FILL OUT ALL REQUIRED* FIELDS. THANKS!</p>
            </ParaHeading>

            <Container>

                <FormContainer>


                    <form>
                        <div class="Fields" style={{ marginTop: "30px" }}>
                            <div style={{ display: "flex" }}>

                                <input style={{ backgroundColor: "lightyellow", width: "320px", margin: "40px 20px 20px 20px", borderBottom: "1px solid gray", borderTop: "none", borderLeft: "none", borderRight: "none" }} placeholder="Name" type="text" id="fname" name="firstname" />
                                <input style={{ backgroundColor: "lightyellow", width: "320px", margin: "40px 20px 20px 20px", borderBottom: "1px solid gray", borderTop: "none", borderLeft: "none", borderRight: "none" }} placeholder="Email" type="text" id="emai;" name="email" />


                            </div>
                            <div style={{ display: "flex" }}>

                                <input style={{ backgroundColor: "lightyellow", width: "320px", margin: "40px 20px 20px 20px", borderBottom: "1px solid gray", borderTop: "none", borderLeft: "none", borderRight: "none" }} placeholder="Contact No." type="text" id="contact" name="contact" />
                                <select style={{ backgroundColor: "lightyellow", width: "320px", margin: "40px 20px 20px 20px", borderBottom: "1px solid gray", borderTop: "none", borderLeft: "none", borderRight: "none" }} name="no_of_persons" id="no_of_persons" class="selectpicker">
                                    <option selected disabled>No. Of persons</option>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                </select>


                            </div>


                            <div style={{ display: "flex" }}>

                                <input style={{ backgroundColor: "lightyellow", width: "320px", margin: "40px 20px 20px 20px", borderBottom: "1px solid gray", borderTop: "none", borderLeft: "none", borderRight: "none" }} type="date" name="date-picker" id="date-picker" placeholder="Date" required="required" data-error="Date is required." />
                                <input style={{ backgroundColor: "lightyellow", width: "320px", margin: "40px 20px 20px 20px", borderBottom: "1px solid gray", borderTop: "none", borderLeft: "none", borderRight: "none" }} type="time" name="time-picker" id="time-picker" placeholder="Time" required="required" data-error="Time is required." />


                            </div>


                        </div>
                        <Subeading>
                            <Button type="submit" value="SEND" id="submit"   >BOOK MY TABLE </Button>
                        </Subeading>
                    </form>


                </FormContainer>



            </Container>
        </>
    )
}

export default Reservation
