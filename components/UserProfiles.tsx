import Image from 'next/image';

export default function UserProfile({ user }) {
  return (
    <div className="box-center">
      <Image
        src={user.photoURL}
        className="card-img-center"
        alt={`/${user.username} photo`}
        height={150}
        width={150}
      />
      <p>
        <i>@{user.username}</i>
      </p>
      <h1>{user.displayName}</h1>
    </div>
  );
}