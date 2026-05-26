---
title: "[자료구조론] 9 AVL 트리(Tree)"
date: 2026-05-20
tags:
  - 컴퓨터사이언스
  - 자료구조론
draft: false
aliases:
---
# AVL 트리(Adelson-Velskii and Landis Tree)

> [!NOTE] AVL 트리
> AVL 트리는 스스로 균형을 맞추는 자가 균형 이진 탐색 트리(Self-balancing binary search tree)이다. 기존 BST의 최악의 케이스인 $O(n)$ 편향 문제를 해결하기 위해 고안되었다

**특징:**
- **높이 균형 규칙 (Height Balance Property):** 트리에 존재하는 **모든 노드**에 대하여, 해당 노드의 **왼쪽 서브트리 높이와 오른쪽 서브트리 높이의 차이가 최대 1 이하**여야한다


## 균형 인수 공식(Balance Factor)
트리의 균형이 깨졌는지 수학적으로 판단하기 위해 각 노드마다 왼쪽과 오른쪽 서브트리의 높이 차이인 diff(균형 인수)를 계산한다

$$\text{diff} = |h_L - h_R|$$
- $h_L$: 왼쪽 서브트리의 높이 (height of left subtree)
- $h_R$: 오른쪽 서브트리의 높이 (height of right subtree)
- **AVL 트리 성립 조건:** 트리의 모든 노드에서 $\text{diff} \le 1$ (즉, 차이가 $0$ 또는 $1$)을 유지해야 한다. 만약 어떤 노드라도 차이가 $2$ 이상이 되면 AVL 규칙이 깨진 것이므로 트리 회전(Rotation)을 통해 구조를 재조정해야 한다



# AVL 트리: insertion
## AVL 트리의 불균형 유형과 회전 연산
AVL 트리에서 새로운 노드가 삽입되어 균형 인수(Balance Factor)의 차이가 2 이상이 되면, 불균형이 발생한 지점과 유발한 노드의 위치 관계에 따라 **4가지 불균형 유형**으로 분류한다. 이를 해결하기 위해 **단일 회전(Single Rotation)** 또는 **이중 회전(Double Rotation)** 연산을 수행한다

### 단일 회전이 필요한 케이스
불균형이 한쪽 방향으로만 치우쳐서 발생한 경우(선형태)로, 단 한 번의 회전으로 균형 맞출 수 있다

**LL 불균형 및 오른쪽 단일 회전**
- 발생 원인: 불균형이 발생한 노드의 **왼쪽(L) 자식**의 **왼쪽(L) 서브트리**에 새로운 노드가 삽입되어 발생한다
- 해결 메커니즘: 불균형 노드를 중심으로 **오른쪽 방향으로 단일 회전**을 시킨다. 왼쪽 자식 노드가 새로운 부모가 되고, 원래 부모였던 노드는 그의 오른쪽 자식으로 내려간다

![[Pasted image 20260521044634.png|400]]
![[Pasted image 20260521045332.png|400]]

**RR 붉균형 및 왼쪽 단일 회전**
- 발생 원인: 불균형이 발생한 노드의 **오른쪽(R) 자식**의 **오른쪽(R) 서브트리**에 새로운 노드가 삽입되어 발생한다
- 해결 메커니즘: 불균형 노드를 중심으로 **왼쪽 방향으로 단일 회전**을 시킨다. 오른쪽 자식 노드가 새로운 부모가 되고, 원래 부모였던 노드는 그의 왼쪽 자식으로 내려간다

![[Pasted image 20260521045415.png|400]]
![[Pasted image 20260521044922.png|400]]

### 이중 회전이 필요한 케이스
불균형이 꺾인 형태로 발생한 경우로, 단일 회전만으로는 균형을 맞출 수 없다. 자식 노드들끼리 먼저 일직선상으로 펴주는1차 회전을 한 뒤, 부모와 2차 회전을 하는 총 2번의 회전이 필요하다

**LR불균형 및 LR 이중 회전**
- 발생 원인: 불균형이 발생한 노드의 **왼쪽(L) 자식**의 **오른쪽(R) 서브트리**에 새로운 노드가 삽입되어 꺾인 형태가 될 때 발생한다
- 해결 메커니즘: 
	- **1차 회전 (Left):** 왼쪽 자식 노드와 그 오른쪽 자식 노드를 대상으로 **왼쪽 회전**을 수행하여 일직선(LL 형태)으로 펴준다
	- **2차 회전 (Right):** 불균형이 시작된 상위 노드를 대상으로 **오른쪽 회전**을 수행하여 최종 균형을 맞춘다

![[Pasted image 20260521045916.png|400]]
![[Pasted image 20260521050002.png|400]]

**RL 불균형 및 RL 이중 회전**
- 발생 원인: 불균형이 발생한 노드의 **오른쪽(R) 자식**의 **왼쪽(L) 서브트리**에 새로운 노드가 삽입되어 지그재그가 될 때 발생한다
- 해결 메커니즘:
	- **1차 회전 (Right):** 오른쪽 자식 노드와 그 왼쪽 자식 노드를 대상으로 **오른쪽 회전**을 수행하여 일직선(RR 형태)으로 펴준다
	- **2차 회전 (Left):** 불균형이 시작된 상위 노드를 대상으로 **왼쪽 회전**을 수행하여 최종 균형을 맞춘다

![[Pasted image 20260521050153.png|400]]
![[Pasted image 20260521050241.png|400]]



# AVL 트리의 코드 구현
## 구조체 선언 및 높이 반환 함수 구현
**구조체 선언**
```C
struct AVLFlode;
typedef struct AVLNode *Position;
typedef struct AVLNode *AVLTree;

struct AVLNode
{
    ElementType Element; // 노드에 저장될 실제 데이터
    AVLTree     Left;    // 왼쪽 자식 노드를 가리키는 포인터
    AVLTree     Right;   // 오른쪽 자식 노드를 가리키는 포인터
    int         Height;  // ★ 균형 확인을 위한 현재 노드의 높이 정보
};
```

**높이 반환 함수**
```C
int Height(Position P)
{
    if (P == NULL)
        return -1; // PPT 규칙: 비어있는 서브트리(NULL)의 높이는 -1
    else
        return P->Height; // 노드가 존재한다면 저장되어 있는 자기 높이 값을 반환
}
```


## 단일 회전 알고리즘 구현
**LL 단일 회전**
```C
Position SingleRotateWithLeft(Position K2) {
    Position K1;

    K1 = K2->Left;       // [단계 1] K2의 왼쪽 자식인 K1을 포인터로 붙잡음
    K2->Left = K1->Right; // [단계 2] K1의 오른쪽 자식(서브트리)을 K2의 왼쪽 자식으로 이사시킴
    K1->Right = K2;      // [단계 3] K2를 K1의 오른쪽 자식으로 내려서 회전시킴

    /* [단계 4] 위치가 바뀐 노드들의 높이(Height)를 다시 계산하여 업데이트 */
    K2->Height = Max(Height(K2->Left), Height(K2->Right)) + 1;
    K1->Height = Max(Height(K1->Left), K2->Height) + 1;

    return K1; /* 새로운 서브트리의 루트가 된 K1을 반환 */
}
```

**RR 단일 회전**
```C
Position SingleRotateWithRight(Position K1) {
    Position K2;

    K2 = K1->Right;      // [단계 1] K1의 오른쪽 자식인 K2를 포인터로 붙잡음
    K1->Right = K2->Left; // [단계 2] K2의 왼쪽 자식(서브트리)을 K1의 오른쪽 자식으로 이사시킴
    K2->Left = K1;       // [단계 3] K1을 K2의 왼쪽 자식으로 내려서 회전시킴

    /* [단계 4] 위치가 바뀐 노드들의 높이(Height)를 다시 계산하여 업데이트 */
    K1->Height = Max(Height(K1->Left), Height(K1->Right)) + 1;
    K2->Height = Max(K1->Height, Height(K2->Right)) + 1;

    return K2; /* 새로운 서브트리의 루트가 된 K2를 반환 */
}
```


## 이중 회전 알고리즘 구현
식 노드 간의 1차 단일 회전 후, 상위 부모 노드와의 2차 단일 회전을 연속으로 조합하여 구현한다
```C
static Position DoubleRotateWithLeft(Position K3) {
    /* [1차 작업] K3의 왼쪽 자식(K1)과 그 자식(K2) 사이에서 오른쪽 단일 회전을 처리 */
    K3->Left = SingleRotateWithRight(K3->Left);

    /* [2차 작업] 루트가 된 K2와 상위 노드 K3 사이에서 왼쪽 단일 회전을 처리하여 최종 반환 */
    return SingleRotateWithLeft(K3);
}
```


## 통합 AVL 트리 삽입 함수
일반 BST의 삽입 과정을 기본으로 하되, 재귀 함수가 반환되면서 **올라오는 길에 각 노드의 균형 상태를 역추적(Backtracking)하여 즉시 교정**하는 구조이다
```C
AVLTree Insert(ElementType X, AVLTree T) {
    if (T == NULL) {
        /* [단계 1] 빈 자리를 찾으면 새로운 리프 노드 생성 */
        T = malloc(sizeof(struct AVLNode));
        if (T == NULL) FatalError("Out of space!!!");
        else {
            T->Element = X; T->Height = 0;
            T->Left = T->Right = NULL;
        }
    }
    else if (X < T->Element) {
        /* [단계 2] 왼쪽 서브트리에 삽입 유도 후 불균형 검사 */
        T->Left = Insert(X, T->Left);
        
        // 왼쪽 서브트리와 오른쪽 서브트리의 높이 차이가 2가 된 경우 (불균형 발생)
        if (Height(T->Left) - Height(T->Right) == 2) {
            if (X < T->Left->Element)
                T = SingleRotateWithLeft(T);  // LL 형태 -> 오른쪽 단일 회전
            else
                T = DoubleRotateWithLeft(T);  // LR 형태 -> LR 이중 회전
        }
    }
    else if (X > T->Element) {
        /* [단계 3] 오른쪽 서브트리에 삽입 유도 후 불균형 검사 */
        T->Right = Insert(X, T->Right);
        
        // 오른쪽 서브트리와 왼쪽 서브트리의 높이 차이가 2가 된 경우 (불균형 발생)
        if (Height(T->Right) - Height(T->Left) == 2) {
            if (X > T->Right->Element)
                T = SingleRotateWithRight(T); // RR 형태 -> 왼쪽 단일 회전
            else
                T = DoubleRotateWithRight(T); // RL 형태 -> RL 이중 회전
        }
    }
    
    /* X가 이미 존재하는 상태(X == T->Element)라면 아무것도 하지 않음 */

    /* [단계 4] 회전 및 배치가 끝난 후 현재 노드의 새로운 높이를 갱신 */
    T->Height = Max(Height(T->Left), Height(T->Right)) + 1;
    return T;
}
```