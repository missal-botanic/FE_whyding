function randomizeItems() {
    const container = document.querySelector('.weekly');
    const items = Array.from(container.children); // Get all item elements

    // 랜덤한 인덱스를 선택하여 해당 아이템을 위로 이동시킴
    const randomIndex = Math.floor(Math.random() * items.length); 
    const selectedItem = items[randomIndex];

    // 첫 번째 아이템은 두 번째 아이템과만 교환 가능
    if (randomIndex === 0 && items.length > 1) {
        // 첫 번째 아이템은 내려가므로 animation-down만 적용
        const secondItem = items[1]; // 두 번째 아이템
        
        // 애니메이션 적용
        selectedItem.classList.add('animation-down');
        secondItem.classList.add('animation-up');

        // 애니메이션 종료 후 위치 변경
        setTimeout(() => {
            // 두 아이템을 교환
            container.insertBefore(secondItem, selectedItem);
            // 애니메이션 클래스 제거
            selectedItem.classList.remove('animation-down');
            secondItem.classList.remove('animation-up');
        }, 1000); // 1초 뒤에 위치 변경
    } else if (randomIndex > 0) {
        // 첫 번째 아이템이 아니라면, 선택된 아이템과 바로 위에 있는 아이템을 위치 변경
        const prevItem = items[randomIndex - 1]; // 바로 위에 있는 아이템
        
        // 두 아이템에 애니메이션을 적용
        selectedItem.classList.add('animation-down');  // 내려갈 애니메이션
        prevItem.classList.add('animation-up');  // 올라갈 애니메이션

        // 애니메이션 종료 후 위치를 교환
        setTimeout(() => {
            container.insertBefore(selectedItem, prevItem); // selectedItem을 prevItem 앞에 위치시킴
            // 애니메이션 끝난 후 위치 교환 처리
            selectedItem.classList.remove('animation-down');
            prevItem.classList.remove('animation-up');
        }, 1000); // 애니메이션 시간이 끝난 후
    }
}

// 5초마다 randomizeItems 함수 실행
setInterval(randomizeItems, 3000);
