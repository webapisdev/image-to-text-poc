import React, { useState } from 'react'
import Grid from "@material-ui/core/Grid";
import Fab from "@material-ui/core/Fab";
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/styles';
import ImageTextCard from './ImageTextCard';
import { Container } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    root: {
        width: 500,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end"
    },
    icon: {
        margin: theme.spacing.unit * 2
    },
    iconHover: {
        margin: theme.spacing.unit * 2,
        "&:hover": {
            color: 'red'
        }
    },
    cardHeader: {
        textalign: "center",
        align: "center",
        backgroundColor: "white"
    },
    input: {
        display: "none"
    },
    title: {
        color: 'blue',
        fontWeight: "bold",
        fontFamily: "Montserrat",
        align: "center"
    },
    button: {
        color: 'blue',
        margin: 10
    },
    secondaryButton: {
        color: "gray",
        margin: 10
    },
    typography: {
        margin: theme.spacing.unit * 2,
        backgroundColor: "default"
    },

    searchRoot: {
        padding: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: 400
    },
    searchInput: {
        marginLeft: 8,
        flex: 1
    },
    searchIconButton: {
        padding: 10
    },
    searchDivider: {
        width: 1,
        height: 28,
        margin: 4
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
}));

export default function UploadImage() {
    const classes = useStyles();

    const [imageToText, setImageToText] = useState({});

    const [unsuportedMediaErrorMessage, setUnsuportedMediaErrorMessage] = useState('');

    function handleUpload2(event) {
        setUnsuportedMediaErrorMessage("");
        var formdata = new FormData();
        formdata.append("File", event.target.files[0], event.target.files[0].name);

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        fetch("http://localhost:7071/api/UploadImage", requestOptions)
            .then(response => response.text())
            .then(result => setImageToText(JSON.parse(result)))
            .catch(error => setUnsuportedMediaErrorMessage("Unsupported Media Type. Only images are supported at this time"));
    }
    return (
        <div>
            <Grid container justify="center" alignItems="center">
                <input
                    accept="image/*"
                    id="contained-button-file"
                    multiple
                    type="file"
                    onChange={handleUpload2}
                    style={{
                        display: "none"
                    }}

                />
                <label htmlFor="contained-button-file">
                    <Fab component="span" className={classes.button} style={{ width: '140px' }}>
                        <AddIcon className={classes.extendedIcon} />
                        Upload Image
                    </Fab>
                </label>

                {!unsuportedMediaErrorMessage ? <Container>
                    {Object.keys(imageToText).length > 0 &&
                        <ImageTextCard imageUrl={imageToText.Url} imageText={imageToText.Text} />}
                </Container> : ""}

                {unsuportedMediaErrorMessage ? <Typography variant="h6" gutterBottom color="primary">
                    {unsuportedMediaErrorMessage}
                </Typography> : ""}

            </Grid>
        </div>
    )
}
