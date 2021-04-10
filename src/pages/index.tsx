import { GetStaticProps } from 'next';
import Head from 'next/head';
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';
import styles from './home.module.scss';

// Client-side (quando não precisa indexação, quando é uma informação carregada a partir de uma ação do usuário...)
// Server-side rendering (quando precisa indexação do google e precisa de dados dinamicos como os dados do usuário que está acessando)
// Static Site Generation (para casos que consegue gerar o html de uma página para que todas as pessoas vejam a mesma coisa, e que precisa de indexação do google)

//Exemplo: Post no blog
// -> Conteúdo (SSG)
// -> Comentários do post (Client-side)

//Para testar os eventos no cmd tem que deixar rodando o comando:
//stripe listen --forward-to localhost:3000/api/webhooks

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>

      <main className={styles.contentContainer} >
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
            Get acces to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>

        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1Id18uK1YUXKRUk6AU3ROptI')

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  }
}