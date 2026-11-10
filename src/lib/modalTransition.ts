import { useContext, useLayoutEffect } from "react";
import { UNSAFE_ViewTransitionContext } from "react-router-dom";

/**
 * 同じページの中の View Transition（ポップアップの開閉）の間だけ html[data-vt="modal"] を付ける。
 * index.css がこれを見て、ページ全体のフェードを止める（別ページへの遷移はいつもどおり）。
 * ブラウザの「戻る」で閉じたときにも効くよう、ルーターの遷移の状態から判定する。
 * ポップアップを開くページ（/anime・トップ）で 1 回呼ぶ。
 */
export const useModalTransitionFlag = () => {
  const vt = useContext(UNSAFE_ViewTransitionContext);
  useLayoutEffect(() => {
    const html = document.documentElement;
    if (vt.isTransitioning && vt.currentLocation.pathname === vt.nextLocation.pathname) html.dataset.vt = "modal";
    else delete html.dataset.vt;
  }, [vt]);
  useLayoutEffect(() => () => void delete document.documentElement.dataset.vt, []);
};
