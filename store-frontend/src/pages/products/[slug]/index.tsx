import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  IconButton,
  Typography,
} from "@material-ui/core";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { Product } from "../../../models";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import http from "../../../http";
import axios from "axios";
import Link from "next/link";

interface ProductDetailPageProps {
  product: Product;
}

const ProductDetailPage: NextPage<ProductDetailPageProps> = ({ product }) => { 
  return (
    <div>
      <Head>
        <title>{product?.name} - Detalhes do produto</title>
      </Head>
      <Card>
        <CardHeader
          title={product.name.toUpperCase()}
          subheader={`R$ ${product.price}`}
        />
        <CardActions>
          <Link
            href={`/products/[slug]/order`}
            as={`/products/${product.slug}/order`}
            passHref
          >
            <Button
              color="primary"
              startIcon={<ShoppingCartIcon />}
              component="a"
            >
              Comprar
            </Button>
          </Link>
        </CardActions>
        <CardMedia style={{ paddingTop: "56%" }} image={product.image_url} />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {product.description}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetailPage;

export const getStaticProps: GetStaticProps<
  ProductDetailPageProps,
  { slug: string }
> = async (context) => {
  try {
    const { slug } = context.params!;
    const { data: product } = await http.get(`products/${slug}`);
    console.log(product);
    return {
      props: {
        product,
      },
      revalidate: 1 * 60 * 2,
    };
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 404) {
      return { notFound: true };
    }
    throw e;
  }
};

export const getStaticPaths: GetStaticPaths = async (context) => {
  const { data: products } = await http.get("products");

  const paths = products.map((product: Product) => ({
    params: { slug: product.slug },
  }));

  return { paths, fallback: "blocking" };
};
