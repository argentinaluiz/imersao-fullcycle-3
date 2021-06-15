import {
  Avatar,
  Box,
  Button,
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
} from "@material-ui/core";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import axios from "axios";
import { Product, CreditCard } from "../../../models";
import http from "../../../http";
import PaymentIcon from "@material-ui/icons/Payment";
import { useForm } from "react-hook-form";
import { useRouter } from "next/dist/client/router";

interface OrderPageProps {
  product: Product;
}

const OrderPage: NextPage<OrderPageProps> = ({ product }) => {
  const { register, handleSubmit, setValue } = useForm();
  const router = useRouter();

  const onSubmit = async (formData: CreditCard) => {
    const { data: order } = await http.post("orders", {
      credit_card: formData,
      items: [{ product_id: product.id, quantity: 1 }],
    });
    router.push(`/orders/${order.id}`);
  };

  return (
    <div>
      <Head>
        <title>{product?.name} - Detalhes do produto</title>
      </Head>
      <Typography component="h1" variant="h3" color="textPrimary" gutterBottom>
        Checkout
      </Typography>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt="Remy Sharp" src={product.image_url} />
        </ListItemAvatar>
        <ListItemText
          primary={product.name}
          secondary={`R$ ${product.price}`}
        />
      </ListItem>
      <Typography variant="h6" gutterBottom>
        Pague com cartão de crédito
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField {...register("name")} required label="Nome" fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              {...register("number")}
              required
              inputProps={{ maxLength: 16 }}
              label="Número do cartão"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              {...register("cvv")}
              required
              type="number"
              label="CVV"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <TextField
                  {...register("expiration_month")}
                  required
                  type="number"
                  label="Expiração mês"
                  fullWidth
                  onChange={(e) =>
                    setValue("expiration_month", parseInt(e.target.value))
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  {...register("expiration_year")}
                  required
                  type="number"
                  label="Expiração ano"
                  fullWidth
                  onChange={(e) =>
                    setValue("expiration_year", parseInt(e.target.value))
                  }
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Box marginTop={3}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<PaymentIcon />}
          >
            Pagar
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default OrderPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { slug } = context.params!;
    const { data: product } = await http.get(`products/${slug}`);
    return {
      props: {
        product,
      },
    };
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 404) {
      return { notFound: true };
    }
    throw e;
  }
};
