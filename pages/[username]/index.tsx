import UserProfile from '../../components/UserProfiles';
import PostFeed from '../../components/PostFeed';

import { getUserWithUsername, postToJSON } from '../../lib/firebase';

export async function getServerSideProps({ params }) {

  const { username } = params;
  const userDoc = await getUserWithUsername(username);

  // If no user, short circuit to 404 page
  if (!userDoc) {
    return {
      notFound: true,
    };
  }

  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data();
    const postsQuery = userDoc.ref
      .collection('posts')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(5);

    posts = (await postsQuery.get()).docs.map(postToJSON);
  }

  return {
    props: { user, posts }, // will be sent to page component as properties
  };
}

export default function UserProfilePage({ user, posts }) {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  );
}
