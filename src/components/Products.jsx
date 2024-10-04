import * as React from "react";
import { experimentalStyled as styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid2";
import "./../assets/styles/products.scss";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setZoomDynamic } from "../js/zoomImg";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

export const Products = () => {
  // Redux
  const dispatch = useDispatch();
  // const allProducts = useSelector((state) => state.products.products);
  const allProducts = [
    {
      id: 1,
      codigo_barras: "1234567890123",
      nombre: "Producto A",
      descripcion:
        "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from ",
      precio: 11.1,
      imagen_url:
        "https://orientalgeneralstores.co.ke/wp-content/uploads/2022/12/test-product.jpg",
      usuario_id: 1,
      cantidad: 100,
    },
    {
      id: 2,
      codigo_barras: "2345678901234",
      nombre: "Producto B",
      descripcion: "Descripción del Producto B",
      precio: 11.1,
      imagen_url:
        "https://orientalgeneralstores.co.ke/wp-content/uploads/2022/12/test-product.jpg",
      usuario_id: 1,
      cantidad: 50,
    },
    {
      id: 3,
      codigo_barras: "3456789012345",
      nombre: "Producto C Arroz",
      descripcion: "Descripción del Producto C",
      precio: 11.1,
      imagen_url:
        "https://orientalgeneralstores.co.ke/wp-content/uploads/2022/12/test-product.jpg",
      usuario_id: 2,
      cantidad: 75,
    },
    {
      id: 4,
      codigo_barras: "123456789",
      nombre: "Producto Daniel",
      descripcion: "D",
      precio: 11.1,
      imagen_url:
        "https://orientalgeneralstores.co.ke/wp-content/uploads/2022/12/test-product.jpg",
      usuario_id: null,
      cantidad: null,
    },
    {
      id: 5,
      codigo_barras: "23207938",
      nombre: "Producto Eloy",
      descripcion: "E",
      precio: 11.1,
      imagen_url:
        "https://orientalgeneralstores.co.ke/wp-content/uploads/2022/12/test-product.jpg",
      usuario_id: null,
      cantidad: null,
    },
    {
      id: 6,
      codigo_barras: "435",
      nombre: "Producto Pedro",
      descripcion: "F",
      precio: 11.1,
      imagen_url:
        "https://orientalgeneralstores.co.ke/wp-content/uploads/2022/12/test-product.jpg",
      usuario_id: null,
      cantidad: null,
    },{
      id: 6,
      codigo_barras: "435",
      nombre: "Producto Pedro",
      descripcion: "F",
      precio: 11.1,
      imagen_url:
        "https://orientalgeneralstores.co.ke/wp-content/uploads/2022/12/test-product.jpg",
      usuario_id: null,
      cantidad: null,
    },{
      id: 7,
      codigo_barras: "435",
      nombre: "Producto Pedro 2",
      descripcion: "F",
      precio: 11.1,
      imagen_url:
        "https://orientalgeneralstores.co.ke/wp-content/uploads/2022/12/test-product.jpg",
      usuario_id: null,
      cantidad: null,
    },{
      id: 8,
      codigo_barras: "435",
      nombre: "Producto Pedro 3 cod435",
      descripcion: "F",
      precio: 11.1,
      imagen_url:
        "https://orientalgeneralstores.co.ke/wp-content/uploads/2022/12/test-product.jpg",
      usuario_id: null,
      cantidad: null,
    },
  ];
  // Redux

  useEffect(() => {
    setZoomDynamic();
  }, [allProducts]);
  console.log(allProducts);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const handleImageClick = () => {
    setIsFullscreen(!isFullscreen);
  };
  return (
    <>
      <Box
        sx={{ flexGrow: 1 }}
        style={{ background: "transparent", paddingInline: "10px" }}
        className="boxProduct"
      >
        <Grid
          container
          spacing={{ xs: 2, md: 2, md: 1.5 }}
          columns={{ xs: 4, sm: 24, md: 60 }}
        >
          {allProducts.map((product, index) => (
            <Grid key={index} size={{ xs: 2, sm: 8, md: 12 }}>
              <Item className="card__product">
                <div className="card__product__internal">
                  <div className="card_image">
                    <img
                      // src={product.imagen_url}
                      src="https://images-na.ssl-images-amazon.com/images/I/41hbmiP+77L._AC_UL450_SR450,320_.jpg"
                      alt={product.descripcion}
                      onClick={handleImageClick}
                    />
                  </div>
                  <div className="card__product__data">
                    <div className="card__product__header">
                      <h2>{product.nombre}</h2>
                    </div>
                    <div className="card_product_description">
                      <p>{product.descripcion}</p>
                    </div>
                    <div className="card_product_price">
                      <p>${product.precio}</p>
                    </div>
                    {/* <div className="card_product_codigo_barras">
                      <p>{product.codigo_barras}</p>
                    </div> */}
                  </div>
                </div>
              </Item>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};
