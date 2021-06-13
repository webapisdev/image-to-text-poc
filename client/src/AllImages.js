import React, { useState, useEffect } from 'react'
import ImageTextCard from './ImageTextCard';
import Grid from "@material-ui/core/Grid";
import { Container, Typography } from "@material-ui/core";

export default function AllImages() {
  const [imagesWithText, setImagesWithText] = useState([]);

  useEffect(() => {
    async function fetchApi() {
      var response = await fetch("http://localhost:7071/api/GetImages");
      response = await response.json();
      setImagesWithText(response);
    }
    fetchApi();
  }, []);

  return (
    <>
      {
        <Container >
          <Grid container spacing={6}>
            {imagesWithText.map((imagesWithText) => (
              <Grid
                key={imagesWithText.ImageUrl}
                xs={12} sm={6}
                item
                style={{ minHeight: '100px' }}
              >
                <ImageTextCard imageUrl={imagesWithText.ImageUrl} imageText={imagesWithText.Text} />
              </Grid>
            ))}
          </Grid>
        </Container>
      }
    </>
  );
}
