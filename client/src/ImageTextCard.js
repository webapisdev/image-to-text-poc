import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { saveAs } from "file-saver";

const useStyles = makeStyles({
    root: {
        maxWidth: 500,
    },
});

export default function ImageTextCard({ imageUrl, imageText }) {
    const classes = useStyles();

    const downloadText = () => {
        var blob = new Blob([imageText], { type: "text/plain;charset=utf-8" });
        saveAs(blob, (imageUrl.split('/').pop()).split('.')[0]);

    }
    return (
        <Card className={classes.root}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    image={imageUrl}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {imageUrl.split('/').pop()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {imageText}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button variant="contained" color="primary" onClick={downloadText}>
                    Download Text
                </Button>

            </CardActions>
        </Card>
    );
}
