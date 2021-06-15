import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import axios from "axios";
import { Invoice, SecureCreditCard } from "../../models";
import { useRouter } from "next/dist/client/router";
import useSWR from "swr";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Grid,
  Typography,
  Select,
  MenuItem,
} from "@material-ui/core";
import { parseISO, format } from "date-fns";
import http from "../../http";
import { useState } from "react";
interface InvoicesListPageProps {
  creditCards: SecureCreditCard[];
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const InvoicesListPage: NextPage<InvoicesListPageProps> = ({ creditCards }) => {

  if (!creditCards.length) {
    return <div>
      <Head>
        <title>Fatura - Nenhum cartão encontrado</title>
      </Head>
      <Typography component="h1" variant="h3" color="textPrimary" gutterBottom>
        Nenhum cartão encontrado
      </Typography>
    </div>;
  }


  const [creditCardNumber, setCreditCardNumber] = useState<string>(
    creditCards[0].number
  );

  const { data: invoices = [], error } = useSWR<Invoice[]>(
    `/api/credit-cards/${creditCardNumber}/invoices`,
    fetcher,
    { refreshInterval: 5000 }
  );

  return (
    <div>
      <Head>
        <title>Fatura - {creditCardNumber}</title>
      </Head>
      <Typography component="h1" variant="h3" color="textPrimary" gutterBottom>
        Fatura
      </Typography>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        defaultValue={creditCardNumber}
        label="Cartão de crédito"
      >
        {creditCards.map((creditCard) => (
          <MenuItem value={creditCard.number}>{creditCard.number}</MenuItem>
        ))}
      </Select>
      <Grid container>
        <Grid item xs={12} sm={3}>
          <List>
            {invoices.map((invoice) => (
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={format(parseISO(invoice.payment_date), "dd/MM/yyyy")}
                />
                <ListItemSecondaryAction>
                  R$ {invoice.amount}
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </div>
  );
};

export default InvoicesListPage;

export const getStaticProps: GetStaticProps<
  InvoicesListPageProps,
  { number: string }
> = async (context) => {
  try {
    const { data: creditCards } = await http.get("credit-cards");

    return {
      props: {
        creditCards,
      },
      revalidate: 30,
    };
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 404) {
      return { notFound: true };
    }
    throw e;
  }
};