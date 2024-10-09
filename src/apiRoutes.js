export const pageRoutes = {
  main: "/",
  register: "/register", // 회원가입
  login: "/login", // 로그인
  cart: "/cart", // 카트
  purchase: "/purchase", // 구매
};

// 카트, 구매 페이지는 로그인이 되어있어야 이동할 수 있음
// 만약 로그인이 안되어있으면 로그인 페이지로 이동함
