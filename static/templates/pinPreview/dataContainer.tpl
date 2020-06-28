<table class="table" data-total = {total}>
    <thead>
        <tr>
            <th scope="col">[[pindealbee:data-container-topic-id]]</th>
            <th scope="col" style="text-align: center">[[pindealbee:data-container-category]]</th>
            <th scope="col">[[pindealbee:data-container-title]]</th>
            <th scope="col" style="text-align: center">[[pindealbee:data-container-view]]</th>
            <th scope="col" style="text-align: center">[[pindealbee:data-container-upvote]]</th>
            <th scope="col">[[pindealbee:data-container-time-created]]</th>
            <th scope="col">[[pindealbee:data-container-time-modified]]</th>
            <th scope="col"></th>
        </tr>
    </thead>
    <tbody>
        <!-- BEGIN topics -->
        <tr>
            <td>{topics.tid}</td>
            <td style="text-align: center">
                <div class="custom-badge" style="background-color: {topics.category.bgColor}; color: {topics.category.color}">
                    {topics.category.name}
                </div>
            </td>
            <td style="max-width: 260px">
                <a href="/topic/{topics.tid}" target="_blank">
                    <strong>
                        {topics.title}
                    </strong>
                </a>
            </td>
            <td style="text-align: center">{topics.viewcount}</td>
            <td style="text-align: center">{topics.upvotes}</td>
            <td>{topics.timestampISOFormat}</td>
            <td>{topics.lastposttimeISOFormat}</td>
            <td>
                <button class="btn btn-primary btn-pin" data-tid={topics.tid} data-category="{topics.category.name}" data-title="{topics.title}">
                    <i class="fa fa-1x fa-thumb-tack"></i>
                </button>
            </td>
        </tr>
        <!-- END topics -->
    </tbody>
</table>