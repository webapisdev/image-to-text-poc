import React, { useState, useEffect } from "react";
import ImageTextCard from "./ImageTextCard";
import Grid from "@material-ui/core/Grid";
import { Container } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function AllImages() {
  const [imagesWithText, setImagesWithText] = useState([]);

  useEffect(() => {
    async function fetchApi() {
      var response = await fetch("/api/GetImages");
      response = await response.json();
      setImagesWithText(response);
    }
    fetchApi();
  }, []);

  return (
    <>
      {
        <Container>
          <Grid container spacing={6}>
            {imagesWithText.length > 0 ? (
              imagesWithText.map((imagesWithText) => (
                <Grid
                  key={imagesWithText.ImageUrl}
                  xs={12}
                  sm={6}
                  item
                  style={{ minHeight: "100px" }}
                >
                  <ImageTextCard
                    imageUrl={imagesWithText.ImageUrl}
                    imageText={imagesWithText.Text}
                  />
                </Grid>
              ))
            ) : (
              <CircularProgress
                color="primary"
                style={{
                  width: "140px",
                  height: "140px",
                  marginLeft: "200px",
                  marginTop: "200px",
                }}
                thickness={2}
              />
            )}
          </Grid>
        </Container>
      }
    </>
  );
}
