export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const User = IDL.Record({
    'username' : IDL.Text,
    'profile_picture' : IDL.Text,
    'streaming_key' : IDL.Text,
    'created_at' : IDL.Int,
    'principal_id' : IDL.Text,
  });
  const Followers = IDL.Record({
    'principal_id' : IDL.Text,
    'followers' : User,
  });
  const Result_7 = IDL.Variant({ 'ok' : IDL.Vec(Followers), 'err' : IDL.Text });
  const Following = IDL.Record({
    'principal_id' : IDL.Text,
    'following' : User,
  });
  const Result_6 = IDL.Variant({ 'ok' : IDL.Vec(Following), 'err' : IDL.Text });
  const Subscribe = IDL.Record({
    'end_date' : IDL.Int,
    'start_date' : IDL.Int,
    'subscribing' : User,
    'principal_id' : IDL.Text,
  });
  const Result_5 = IDL.Variant({ 'ok' : IDL.Vec(Subscribe), 'err' : IDL.Text });
  const Result_4 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const Result_3 = IDL.Variant({ 'ok' : Subscribe, 'err' : IDL.Text });
  const Result_1 = IDL.Variant({ 'ok' : User, 'err' : IDL.Text });
  const Result_2 = IDL.Variant({ 'ok' : IDL.Bool, 'err' : IDL.Text });
  return IDL.Service({
    'deleteUser' : IDL.Func([IDL.Text], [Result], []),
    'follow' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
    'getAllFollowers' : IDL.Func([IDL.Text], [Result_7], []),
    'getAllFollowing' : IDL.Func([IDL.Text], [Result_6], []),
    'getAllSubscriptions' : IDL.Func([IDL.Text], [Result_5], []),
    'getAllUsers' : IDL.Func([], [IDL.Vec(User)], []),
    'getFollowersCount' : IDL.Func([IDL.Text], [Result_4], []),
    'getFollowingCount' : IDL.Func([IDL.Text], [Result_4], []),
    'getSubscribersCount' : IDL.Func([IDL.Text], [Result_4], []),
    'getSubscriptionDetails' : IDL.Func([IDL.Text, IDL.Text], [Result_3], []),
    'getUser' : IDL.Func([IDL.Text], [Result_1], []),
    'getUserByStreamingKey' : IDL.Func([IDL.Text], [Result_1], []),
    'isFollowing' : IDL.Func([IDL.Text, IDL.Text], [Result_2], []),
    'isSubscribed' : IDL.Func([IDL.Text, IDL.Text], [Result_2], []),
    'register' : IDL.Func([IDL.Text, User], [Result_1], []),
    'subscribe' : IDL.Func([IDL.Text, IDL.Text, IDL.Nat], [Result], []),
    'unfollow' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
    'unsubscribe' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
