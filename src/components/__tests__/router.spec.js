import { shallowMount, RouterLinkStub } from "@vue/test-utils";
import PlaylistItem from "@/components/PlaylistItem.vue";

describe("router", () => {
  it("renders router link", () => {
    const track = { docId: "123" };

    const wrapper = shallowMount(PlaylistItem, {
      propsData: { track },
      global: {
        stubs: { RouterLink: RouterLinkStub },
      },
    });

    expect(wrapper.findComponent(RouterLinkStub).props().to).toEqual({
      name: "track",
      params: { id: track.docId },
    });
  });
});
