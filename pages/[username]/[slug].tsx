import styles from '../../styles/Post.module.css';
import PostContent from '../../components/PostContent';
import { UserContext } from '../../lib/context';
import { firestore, getUserWithUsername, postToJSON } from '../../lib/firebase';

import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useContext } from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';
import AuthCheck from '../../components/AuthCheck';
import HeartButton from '../../components/HeartButton';


export const getStaticProps: GetStaticProps = async ({ params }) => {


  // AND WE GET { username: 'thegarak', slug: 'a-new-post' } SO IT MUST NOT BE SOOOO BAD !!!!

  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post = null;
  let path: string = null;

  if (userDoc) {

    // @ts-ignore: post and slug types are hard to define!!
    const postRef = userDoc.ref.collection('posts').doc(slug); //todo remove the ignore and fix the code!
    const postRefValue = await postRef.get();

    post = postToJSON(postRefValue);
    path = postRef.path;
  }

  return {
    props: { post, path },
    revalidate: 5000,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const snapshot = await firestore.collectionGroup('posts').get();

  const paths = snapshot.docs.map((doc) => {
    const { username, slug } = doc.data();

    return {
      params: { username, slug },
    };
  });

  return {
    // must be in this format:
    // paths: [
    //   { params: { username, slug }}
    // ],
    paths,
    fallback: 'blocking',
  };
};

export default function Post({ post, path }) {

  const postRef = firestore.doc(path);
  const [realtimePost] = useDocumentData(postRef);

  const realPost = realtimePost || post;

  const { user: currentUser } = useContext(UserContext);

  return (
    <main className={styles.container}>
      <section>
        <PostContent post={realPost} />
      </section>

      <aside className="card">
        <p>
          <strong>{realPost.heartCount || 0} 💖</strong>
        </p>

        <AuthCheck
          fallback={
            <Link href="/enter" passHref>
              <button>💗 Sign Up</button>
            </Link>
          }
        >
          <HeartButton postRef={postRef} />
        </AuthCheck>

        {currentUser?.uid === post.uid && (
          <Link href={`/admin/${post.slug}`} passHref>
            <button className="btn-blue">Edit Post</button>
          </Link>
        )}

      </aside>
    </main>
  );
}