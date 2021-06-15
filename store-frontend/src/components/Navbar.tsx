import * as React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
} from "@material-ui/core";
import StoreIcon from "@material-ui/icons/Store";
import Link from "next/link";

export const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Link href={"/"} as={`/`} passHref>
          <Button color="inherit" startIcon={<StoreIcon />} component="a">
            <Typography variant="h6">Code Store</Typography>
          </Button>
        </Link>
      </Toolbar>
    </AppBar>
  );
};
