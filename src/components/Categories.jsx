import styled from "styled-components";
import { categories } from "../data";
import { mobile } from "../responsive";
import CategoryItem from "./CategoryItem";

const Container = styled.div`
  display: flex;
  padding: 20px;
  justify-content: space-between;
  ${mobile({ padding: "0px", flexDirection: "column" })}

`;


const Heading = styled.div`
display:flex;
justify-content:center;
align-items:center"

`;

const Categories = () => {
  return (
    <>
      <Heading>
        <h1 style={{ color: "black", marginTop: "40px", marginBottom: "20px" }}>OUR SPECIALS</h1>

      </Heading>
      <Heading>
        <hr style={{ background: "red", border: "none", marginBottom: "20px", display: "flex", width: "180px", justifyContent: "center", alignItems: "center", textDecorationColor: "red", height: "2px", content: "", }} />
      </Heading>
      <Container>
        {categories.map((item) => (
          <CategoryItem item={item} key={item.id} />
        ))}
      </Container>
    </>
  );
};

export default Categories;
