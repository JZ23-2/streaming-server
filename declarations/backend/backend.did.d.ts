import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Followers { 'principal_id' : string, 'followers' : User }
export interface Following { 'principal_id' : string, 'following' : User }
export type Result = { 'ok' : string } |
  { 'err' : string };
export type Result_1 = { 'ok' : User } |
  { 'err' : string };
export type Result_2 = { 'ok' : boolean } |
  { 'err' : string };
export type Result_3 = { 'ok' : Subscribe } |
  { 'err' : string };
export type Result_4 = { 'ok' : bigint } |
  { 'err' : string };
export type Result_5 = { 'ok' : Array<Subscribe> } |
  { 'err' : string };
export type Result_6 = { 'ok' : Array<Following> } |
  { 'err' : string };
export type Result_7 = { 'ok' : Array<Followers> } |
  { 'err' : string };
export interface Subscribe {
  'end_date' : bigint,
  'start_date' : bigint,
  'subscribing' : User,
  'principal_id' : string,
}
export interface User {
  'username' : string,
  'profile_picture' : string,
  'streaming_key' : string,
  'created_at' : bigint,
  'principal_id' : string,
}
export interface _SERVICE {
  'deleteUser' : ActorMethod<[string], Result>,
  'follow' : ActorMethod<[string, string], Result>,
  'getAllFollowers' : ActorMethod<[string], Result_7>,
  'getAllFollowing' : ActorMethod<[string], Result_6>,
  'getAllSubscriptions' : ActorMethod<[string], Result_5>,
  'getAllUsers' : ActorMethod<[], Array<User>>,
  'getFollowersCount' : ActorMethod<[string], Result_4>,
  'getFollowingCount' : ActorMethod<[string], Result_4>,
  'getSubscribersCount' : ActorMethod<[string], Result_4>,
  'getSubscriptionDetails' : ActorMethod<[string, string], Result_3>,
  'getUser' : ActorMethod<[string], Result_1>,
  'getUserByStreamingKey' : ActorMethod<[string], Result_1>,
  'isFollowing' : ActorMethod<[string, string], Result_2>,
  'isSubscribed' : ActorMethod<[string, string], Result_2>,
  'register' : ActorMethod<[string, User], Result_1>,
  'subscribe' : ActorMethod<[string, string, bigint], Result>,
  'unfollow' : ActorMethod<[string, string], Result>,
  'unsubscribe' : ActorMethod<[string, string], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
