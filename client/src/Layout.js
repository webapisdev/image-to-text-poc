import { makeStyles } from "@material-ui/styles";
import React from "react";
import {
    Drawer,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@material-ui/core";

import { SubjectOutlined } from "@material-ui/icons";
import { useHistory, useLocation } from "react-router-dom";

import { AppBar, Toolbar } from "@material-ui/core";


const drawerWidth = 200;
const useStyles = makeStyles((theme) => {
    return {
        page: {
            background: "#f9f9f9",
            width: "100%",
            padding: theme.spacing(3)
        },
        drawer: {
            width: drawerWidth,
        },

        drawerPaper: {
            width: drawerWidth,
        },
        root: {
            display: "flex",
        },
        active: {
            background: "#f4f4f4",
        },
        title: {
            padding: theme.spacing(2),
        },
        appbar: {
            width: `calc(100% - ${drawerWidth}px)`,
            backgroundColor: "#000",
            color: "#000",
            paddingLeft: drawerWidth
        },
        toolbar: theme.mixins.toolbar,
    };
});

export default function Layout({ children }) {
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();

    const menuItems = [
        {
            text: "Upload New Image",
            icon: <SubjectOutlined color="primary" />,
            path: "/uploadimage",
        },
        {
            text: "All Images",
            icon: <SubjectOutlined color="primary" />,
            path: "/getImages",
        }


    ];

    return (
        <div className={classes.root}>
            {/*app bar*/}
            <AppBar className={classes.appbar}>
                <Toolbar style={{ backgroundColor: "#ededed" }}>
                    <Typography variant="h6" style={{ color: "#000", fontWeight: 'bold' }}>
                        Text to Image app using Azure Static App, Functions, Cognitive API, and Blob storage
                    </Typography>
                </Toolbar>
            </AppBar>
            {/*side bar*/}
            <Drawer
                className={classes.drawer}
                variant="permanent"
                anchor="left"
                classes={{ paper: classes.drawerPaper }}
            >
                <div>
                    <Typography variant="h6" className={classes.title}>
                        Image to Text
                    </Typography>
                </div>

                <List>
                    {menuItems.map((item) => (
                        <ListItem
                            button
                            key={item.text}
                            onClick={() => {
                                history.push(item.path);
                            }}
                            className={
                                location.pathname === item.path ? classes.active : null
                            }
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text}></ListItemText>
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            <div className={classes.page}>
                <div className={classes.toolbar}></div>
                {children}
            </div>
        </div>
    );
}
