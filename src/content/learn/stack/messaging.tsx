import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, ComparisonTable, KeyPoints, Divider } from "../../../components/learn/kit";
import { Tech } from "../../../components/learn/TechStackPanel";

export const meta: LearnMeta = {
  id: "messaging-stack",
  title: "メッセージング / リアルタイムの技術スタック",
  description: "サービス間を疎結合につなぐメッセージング（Kafka/RabbitMQ）と、ブラウザとのリアルタイム通信（WebSocket/Socket.IO）の代表スタックを俯瞰する。",
  domain: "stack",
  section: "messaging",
  order: 1,
  level: "basic",
  tags: ["Kafka", "WebSocket", "メッセージキュー", "リアルタイム"],
  updated: "2026-07-09",
  minutes: 7,
};

export default function Article() {
  return (
    <>
      <Lead>
        「重い処理を後回しにする」「サービス同士を疎結合につなぐ」ためのメッセージング基盤と、「チャットや通知をリアルタイムに届ける」ための双方向通信。この2つは似て非なる用途で、それぞれ定番があります。
      </Lead>

      <Section>メッセージング / イベント基盤</Section>
      <ComparisonTable
        headers={["技術", "特徴", "向いている場面"]}
        rows={[
          [<Tech id="kafka">Apache Kafka</Tech>, "高スループットの分散ストリーム", "大規模なイベント駆動・ログ収集"],
          [<Tech id="rabbitmq">RabbitMQ</Tech>, "柔軟なルーティングのキュー", "ジョブキュー・非同期処理"],
          [<Tech id="nats">NATS</Tech>, "軽量・高速な Pub/Sub", "軽量なマイクロサービス通信"],
          [<Tech id="sqs">Amazon SQS / SNS</Tech>, "AWS のマネージドキュー/通知", "AWS 上で運用不要の非同期処理"],
        ]}
      />
      <Callout variant="info" title="キューとストリームの違い">
        <Tech id="rabbitmq">RabbitMQ</Tech> は「タスクを1回処理して消す」キュー向き、<Tech id="kafka">Kafka</Tech> は「イベントを流し続け、複数が読む」ストリーム向き。用途で使い分けます。
      </Callout>

      <Section>リアルタイム通信</Section>
      <ComparisonTable
        headers={["技術", "役割"]}
        rows={[
          [<Tech id="websocket">WebSocket</Tech>, "ブラウザ⇔サーバーの双方向通信の土台"],
          [<Tech id="socketio">Socket.IO</Tech>, "WebSocket を扱いやすくする定番ライブラリ"],
          [<Tech id="pusher">Pusher</Tech>, "自前運用不要のマネージドなリアルタイム基盤（Ably 等）"],
          [<Tech id="trpc">tRPC</Tech>, "TS でフロント/バックを型安全につなぐ（通信の型連携）"],
        ]}
      />

      <Divider />

      <KeyPoints
        items={[
          "メッセージングは非同期処理・サービス疎結合のための土台",
          "大規模ストリームは Kafka、ジョブキューは RabbitMQ、AWS は SQS/SNS",
          "リアルタイム通信の土台は WebSocket、扱いやすくするのが Socket.IO",
          "自前運用を避けるなら Pusher/Ably などのマネージド基盤",
          "キュー(1回消費)とストリーム(流し続ける)を用途で使い分ける",
        ]}
      />
    </>
  );
}
