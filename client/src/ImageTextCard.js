import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    root: {
        maxWidth: 500,
    },
});

export default function ImageTextCard({ imageUrl, imageText }) {
    const classes = useStyles();

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
        </Card>
    );
}
