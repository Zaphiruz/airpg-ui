import Head from "next/head";

import pageStyles from "../../styles/page.module.css";
import footerStyles from "../../styles/footer.module.css";

import { useRouter } from 'next/router'
import { titleCase } from '../../utils/format';

export default function Page() {
  const router = useRouter()
  const collectionName = router.query.collectionName;

  return (
    <div className={pageStyles.container}>
      <Head>
				<title>AI RPG {titleCase(collectionName)} Collection</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

      <main className={pageStyles.main}>
        <h1 className={pageStyles.title}>{titleCase(collectionName)} Collection</h1>
        <p className={pageStyles.description}>
					Here, you can use basic CRUD opperations on {titleCase(collectionName)} items
				</p>
      </main>

      <footer className={footerStyles.footer}></footer>
    </div>
  )
}